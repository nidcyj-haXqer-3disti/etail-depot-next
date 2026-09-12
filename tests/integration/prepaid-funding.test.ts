import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { and, eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  closeDatabase,
  getDb,
} from "../../src/platform/database/client";
import {
  cards,
  permissionGrants,
  serviceActivity,
  workspaceCommands,
} from "../../src/platform/database/schema";
import {
  ledgerEntries,
  ledgerJournals,
} from "../../src/modules/ledger/schema";
import { getBalance } from "../../src/modules/ledger";
import {
  cardholderFundingIntents,
  cardholderLimitChanges,
  cardholderSpendingLimits,
  cardholderTopups,
} from "../../src/modules/workspace/funding-schema";
import {
  addCardholderFunds,
  confirmCardholderFunding,
  getCardholderFundingIntent,
  getCardholderFunds,
  getCardholderTopup,
  getPersonSpending,
  getWorkspace,
  prepareCardholderFunding,
  purchaseCard,
  setCardholderSpendingLimit,
  startCardRequest,
  submitCardRequest,
  updateCardRequest,
} from "../../src/modules/workspace/service";
import {
  cardPerson,
  cardPrimary,
  enrollCardholder,
} from "../helpers/cardholder";

const raw = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  application_name: "etail-prepaid-integrity-tests",
});

beforeAll(() => raw.connect());
afterAll(async () => {
  await raw.end();
  await closeDatabase();
});

type Primary = Awaited<ReturnType<typeof cardPrimary>>;

function fundingInput(amountMinor: string, commandId = randomUUID()) {
  return {
    commandId,
    amountMinor,
    currency: "USD" as const,
    source: "SANDBOX_BANK" as const,
  };
}

function fundGroup(owner: Primary, amountMinor: string) {
  return addCardholderFunds(
    owner.personId,
    owner.serviceId,
    fundingInput(amountMinor),
  );
}

async function setLimit(
  owner: Primary,
  holderId: string,
  monthlyLimitMinor: string,
) {
  const current = await getPersonSpending(
    owner.personId,
    owner.serviceId,
    holderId,
  );
  return setCardholderSpendingLimit(
    owner.personId,
    owner.serviceId,
    holderId,
    {
      commandId: randomUUID(),
      expectedVersion: current.version,
      monthlyLimitMinor,
    },
  );
}

/** Creates a card through the canonical lifecycle, without adding money. */
async function issueBare(
  owner: Primary,
  holderId = owner.personId,
  nickname = "Fictional prepaid card",
) {
  const draft = await startCardRequest(owner.personId, owner.serviceId, {
    commandId: randomUUID(),
  });
  const saved = await updateCardRequest(
    owner.personId,
    owner.serviceId,
    draft.id,
    {
      commandId: randomUUID(),
      expectedVersion: draft.version,
      holderId,
      nickname,
      format: "VIRTUAL",
    },
  );
  const submit = {
    commandId: randomUUID(),
    expectedVersion: saved.version,
  };
  const issued = await submitCardRequest(
    owner.personId,
    owner.serviceId,
    saved.id,
    submit,
  );
  expect(issued.status).toBe("ISSUED");
  expect(issued.issuedCardId).not.toBeNull();

  const card = (await getWorkspace(holderId, owner.serviceId)).cards.find(
    row => row.id === issued.issuedCardId,
  );
  if (!card) throw new Error("Canonical issued card is unavailable");

  return { card, requestId: saved.id, submit, issued };
}

const groupBalance = (serviceId: string) =>
  getDb().transaction(tx =>
    getBalance(tx, { serviceId, bucket: "GROUP_AVAILABLE" }),
  );

const topupsFor = (serviceId: string) =>
  getDb()
    .select()
    .from(cardholderTopups)
    .where(eq(cardholderTopups.serviceId, serviceId));

const limitHistory = (serviceId: string, personId: string) =>
  getDb()
    .select()
    .from(cardholderLimitChanges)
    .where(
      and(
        eq(cardholderLimitChanges.serviceId, serviceId),
        eq(cardholderLimitChanges.personId, personId),
      ),
    )
    .orderBy(cardholderLimitChanges.version);

const journalsFor = (serviceId: string) =>
  getDb()
    .selectDistinct({ id: ledgerJournals.id })
    .from(ledgerJournals)
    .innerJoin(
      ledgerEntries,
      eq(ledgerEntries.journalId, ledgerJournals.id),
    )
    .where(eq(ledgerEntries.serviceId, serviceId));

async function waitForBlockedCommand(
  observer: pg.Client,
  lockerPid: number,
  excluded: number[] = [],
) {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    const result = await observer.query<{ pid: number }>(
      `SELECT pid
       FROM pg_stat_activity
       WHERE datname=current_database()
         AND $1::integer=ANY(pg_blocking_pids(pid))
         AND NOT (pid=ANY($2::integer[]))
       ORDER BY pid
       LIMIT 1`,
      [lockerPid, excluded],
    );
    if (result.rows[0]) return result.rows[0].pid;
    await delay(10);
  }
  throw new Error("Expected a real PostgreSQL service-lock wait");
}

/** Proves both commands were in flight before releasing their shared lock. */
async function overlap<T>(
  serviceId: string,
  first: () => Promise<T>,
  second: () => Promise<T>,
) {
  const locker = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    application_name: "etail-prepaid-service-barrier",
  });
  const observer = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    application_name: "etail-prepaid-observer",
  });
  const pending: Promise<T>[] = [];
  let open = false;

  try {
    await locker.connect();
    await observer.connect();
    await locker.query("BEGIN");
    open = true;
    const result = await locker.query<{ pid: number }>(
      "SELECT pg_backend_pid() AS pid",
    );
    const lockerPid = result.rows[0]!.pid;
    await locker.query(
      "SELECT pg_advisory_xact_lock(hashtextextended($1,0))",
      [`workspace:${serviceId}`],
    );

    const firstPromise = first();
    pending.push(firstPromise);
    void firstPromise.catch(() => undefined);
    const firstPid = await waitForBlockedCommand(observer, lockerPid);

    const secondPromise = second();
    pending.push(secondPromise);
    void secondPromise.catch(() => undefined);
    const secondPid = await waitForBlockedCommand(
      observer,
      lockerPid,
      [firstPid],
    );
    expect(secondPid).not.toBe(firstPid);

    await locker.query("COMMIT");
    open = false;
    return await Promise.allSettled(pending);
  } finally {
    if (open) await locker.query("ROLLBACK");
    await Promise.allSettled(pending);
    await Promise.all([locker.end(), observer.end()]);
  }
}

async function rawTransaction(work: () => Promise<unknown>) {
  await raw.query("BEGIN");
  try {
    await work();
    await raw.query("COMMIT");
  } catch (error) {
    await raw.query("ROLLBACK");
    throw error;
  }
}

/** Deliberately incomplete financial effect for database rejection tests. */
async function rawFundingJournal(
  serviceId: string,
  receiptId: string,
  amount: bigint,
  createdAt: Date,
) {
  const id = randomUUID();
  await raw.query(
    `INSERT INTO ledger_journals
       (id,"businessKey",kind,"referenceId",digest,"createdAt")
     VALUES ($1,$2,'GROUP_FUNDING',$3,$4,$5)`,
    [
      id,
      `prepaid-integrity:${id}`,
      receiptId,
      "a".repeat(64),
      createdAt,
    ],
  );
  await raw.query(
    `INSERT INTO ledger_entries
       ("journalId","lineNumber","serviceId",bucket,"deltaMinor")
     VALUES
       ($1,1,$2,'PRACTICE_SOURCE',$3::bigint),
       ($1,2,$2,'GROUP_AVAILABLE',$4::bigint)`,
    [id, serviceId, (-amount).toString(), amount.toString()],
  );
  return id;
}

describe("shared prepaid Cardholder funds", () => {
  it("issues exactly once without funding or changing a person's limit", async () => {
    const owner = await cardPrimary("Fictional unfunded primary");
    const first = await issueBare(owner);

    expect(first.card.available.minor).toBe("0");
    expect(first.card.canPurchase).toBe(false);
    expect(await groupBalance(owner.serviceId)).toBe(0n);
    expect(await topupsFor(owner.serviceId)).toEqual([]);
    expect(await journalsFor(owner.serviceId)).toEqual([]);
    expect(
      await getPersonSpending(
        owner.personId,
        owner.serviceId,
        owner.personId,
      ),
    ).toMatchObject({
      version: 0,
      monthlyLimit: { minor: "0" },
      spentThisMonth: { minor: "0" },
    });

    expect(
      await submitCardRequest(
        owner.personId,
        owner.serviceId,
        first.requestId,
        first.submit,
      ),
    ).toEqual(first.issued);
    expect(
      await getDb()
        .select()
        .from(cards)
        .where(eq(cards.requestId, first.requestId)),
    ).toHaveLength(1);

    await fundGroup(owner, "5000");
    await setLimit(owner, owner.personId, "4000");
    const before = await getCardholderFunds(
      owner.personId,
      owner.serviceId,
    );
    await issueBare(owner, owner.personId, "Second unfunded card");
    expect(
      await getCardholderFunds(owner.personId, owner.serviceId),
    ).toEqual(before);
    expect(await journalsFor(owner.serviceId)).toHaveLength(1);
  });

  it("posts one exact top-up for concurrent retries and rejects changed reuse", async () => {
    const owner = await cardPrimary("Fictional top-up primary");
    const input = fundingInput("12501");

    const receipts = await Promise.all(
      Array.from({ length: 6 }, () =>
        addCardholderFunds(owner.personId, owner.serviceId, input),
      ),
    );
    expect(receipts.every(receipt => receipt.id === input.commandId)).toBe(true);
    expect(receipts.every(receipt =>
      JSON.stringify(receipt) === JSON.stringify(receipts[0]),
    )).toBe(true);
    expect(await groupBalance(owner.serviceId)).toBe(12501n);

    const rows = await topupsFor(owner.serviceId);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      id: input.commandId,
      actorId: owner.personId,
      amountMinor: 12501n,
      currency: "USD",
      source: "SANDBOX_BANK",
    });
    const entries = await getDb()
      .select()
      .from(ledgerEntries)
      .where(eq(ledgerEntries.journalId, rows[0]!.journalId));
    expect(entries).toHaveLength(2);
    expect(entries.every(line =>
      line.serviceId === owner.serviceId &&
      line.cardId === null &&
      line.merchantUnitId === null,
    )).toBe(true);
    expect(
      entries
        .map(line => [line.bucket, line.deltaMinor.toString()])
        .sort((a, b) => a[0]!.localeCompare(b[0]!)),
    ).toEqual([
      ["GROUP_AVAILABLE", "12501"],
      ["PRACTICE_SOURCE", "-12501"],
    ]);
    expect(entries.reduce((sum, line) => sum + line.deltaMinor, 0n)).toBe(0n);
    expect(
      await getDb()
        .select()
        .from(workspaceCommands)
        .where(eq(workspaceCommands.commandId, input.commandId)),
    ).toHaveLength(1);

    await expect(
      addCardholderFunds(owner.personId, owner.serviceId, {
        ...input,
        amountMinor: "12502",
      }),
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
    expect(await groupBalance(owner.serviceId)).toBe(12501n);
    expect(await topupsFor(owner.serviceId)).toHaveLength(1);
  });

  it("recovers a durable funding intent and confirms its original amount once", async () => {
    const owner = await cardPrimary("Fictional funding recovery primary");
    const input = fundingInput("3107");
    const prepared = await prepareCardholderFunding(
      owner.personId,
      owner.serviceId,
      input,
    );

    expect(prepared).toMatchObject({
      id: input.commandId,
      amount: { minor: "3107" },
      receipt: null,
    });
    expect(prepared).not.toHaveProperty("confirmCommandId");
    expect(await groupBalance(owner.serviceId)).toBe(0n);
    expect(await topupsFor(owner.serviceId)).toEqual([]);
    expect(
      await prepareCardholderFunding(owner.personId, owner.serviceId, input),
    ).toEqual(prepared);

    // A fresh read supplies all client-visible recovery state.
    const recovered = await getCardholderFundingIntent(
      owner.personId,
      owner.serviceId,
      prepared.id,
    );
    expect(recovered).toEqual(prepared);

    const confirmations = await Promise.all(
      Array.from({ length: 4 }, () =>
        confirmCardholderFunding(
          owner.personId,
          owner.serviceId,
          recovered.id,
        ),
      ),
    );
    expect(new Set(confirmations.map(receipt => receipt.id)).size).toBe(1);
    expect(confirmations[0]!.amount.minor).toBe("3107");
    expect(await groupBalance(owner.serviceId)).toBe(3107n);
    expect(await topupsFor(owner.serviceId)).toHaveLength(1);
    expect(await journalsFor(owner.serviceId)).toHaveLength(1);
    expect(
      await getDb()
        .select()
        .from(cardholderFundingIntents)
        .where(eq(cardholderFundingIntents.serviceId, owner.serviceId)),
    ).toHaveLength(1);
    expect(
      await getCardholderFundingIntent(
        owner.personId,
        owner.serviceId,
        prepared.id,
      ),
    ).toMatchObject({ receipt: confirmations[0] });

    await expect(
      prepareCardholderFunding(owner.personId, owner.serviceId, {
        ...input,
        amountMinor: "9999",
      }),
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
    expect(
      await confirmCardholderFunding(
        owner.personId,
        owner.serviceId,
        prepared.id,
      ),
    ).toEqual(confirmations[0]);
    expect(await groupBalance(owner.serviceId)).toBe(3107n);
  });

  it("enforces one person's monthly limit across overlapping purchases on two cards", async () => {
    const owner = await cardPrimary("Fictional multiple-card primary");
    await fundGroup(owner, "20000");
    await setLimit(owner, owner.personId, "10000");
    const first = await issueBare(owner, owner.personId, "Everyday card");
    const second = await issueBare(owner, owner.personId, "Travel card");

    const results = await overlap(
      owner.serviceId,
      () => purchaseCard(owner.personId, owner.serviceId, first.card.id, {
        commandId: randomUUID(),
        expectedVersion: first.card.version,
        amountMinor: "6000",
        description: "Fictional first-card purchase",
      }),
      () => purchaseCard(owner.personId, owner.serviceId, second.card.id, {
        commandId: randomUUID(),
        expectedVersion: second.card.version,
        amountMinor: "6000",
        description: "Fictional second-card purchase",
      }),
    );
    expect(results[0]).toMatchObject({ status: "fulfilled" });
    expect(results[1]).toMatchObject({
      status: "rejected",
      reason: { code: "SPENDING_LIMIT_EXCEEDED" },
    });
    expect(await groupBalance(owner.serviceId)).toBe(14000n);
    expect(
      await getPersonSpending(
        owner.personId,
        owner.serviceId,
        owner.personId,
      ),
    ).toMatchObject({
      monthlyLimit: { minor: "10000" },
      spentThisMonth: { minor: "6000" },
      remainingThisMonth: { minor: "4000" },
      available: { minor: "4000" },
    });

    const third = await issueBare(owner, owner.personId, "Additional card");
    expect(third.card.available.minor).toBe("4000");
    expect(await groupBalance(owner.serviceId)).toBe(14000n);
    expect(await limitHistory(owner.serviceId, owner.personId)).toHaveLength(1);
    expect(
      await getDb()
        .select()
        .from(serviceActivity)
        .where(eq(serviceActivity.serviceId, owner.serviceId)),
    ).toHaveLength(1);
  }, 30_000);

  it("prevents two people from spending the same shared group funds", async () => {
    const owner = await cardPrimary("Fictional shared-pool primary");
    const secondaryId = await cardPerson("Fictional shared-pool secondary");
    await enrollCardholder(owner.personId, owner.serviceId, secondaryId);
    await fundGroup(owner, "10000");
    await setLimit(owner, owner.personId, "15000");
    await setLimit(owner, secondaryId, "15000");
    const primaryCard = await issueBare(owner);
    const secondaryCard = await issueBare(owner, secondaryId);

    const results = await overlap(
      owner.serviceId,
      () => purchaseCard(owner.personId, owner.serviceId, primaryCard.card.id, {
        commandId: randomUUID(),
        expectedVersion: primaryCard.card.version,
        amountMinor: "6000",
        description: "Fictional primary purchase",
      }),
      () => purchaseCard(secondaryId, owner.serviceId, secondaryCard.card.id, {
        commandId: randomUUID(),
        expectedVersion: secondaryCard.card.version,
        amountMinor: "6000",
        description: "Fictional secondary purchase",
      }),
    );
    expect(results[0]).toMatchObject({ status: "fulfilled" });
    expect(results[1]).toMatchObject({
      status: "rejected",
      reason: { code: "INSUFFICIENT_PRACTICE_FUNDS" },
    });
    expect(await groupBalance(owner.serviceId)).toBe(4000n);
    expect(
      await getPersonSpending(secondaryId, owner.serviceId, secondaryId),
    ).toMatchObject({
      monthlyLimit: { minor: "15000" },
      spentThisMonth: { minor: "0" },
      remainingThisMonth: { minor: "15000" },
      available: { minor: "4000" },
    });
    expect(
      await getDb()
        .select()
        .from(serviceActivity)
        .where(eq(serviceActivity.serviceId, owner.serviceId)),
    ).toHaveLength(1);
  }, 30_000);

  it("denies secondary funding and limit authority even with forged grants", async () => {
    const owner = await cardPrimary("Fictional funding authority primary");
    const secondaryId = await cardPerson("Fictional restricted secondary");
    await enrollCardholder(owner.personId, owner.serviceId, secondaryId);
    await setLimit(owner, secondaryId, "5000");
    await issueBare(owner, secondaryId);
    const receipt = await fundGroup(owner, "3000");
    const intent = await prepareCardholderFunding(
      owner.personId,
      owner.serviceId,
      fundingInput("2000"),
    );

    await getDb().insert(permissionGrants).values(
      [
        "cardholder.funds.read",
        "cardholder.funds.add",
        "cardholder.limits.manage",
      ].map(action => ({
        serviceId: owner.serviceId,
        personId: secondaryId,
        action,
      })),
    ).onConflictDoNothing();

    const denied = [
      () => getCardholderFunds(secondaryId, owner.serviceId),
      () => getCardholderTopup(secondaryId, owner.serviceId, receipt.id),
      () => getCardholderFundingIntent(secondaryId, owner.serviceId, intent.id),
      () => prepareCardholderFunding(
        secondaryId, owner.serviceId, fundingInput("1"),
      ),
      () => confirmCardholderFunding(secondaryId, owner.serviceId, intent.id),
      () => addCardholderFunds(
        secondaryId, owner.serviceId, fundingInput("1"),
      ),
      () => setCardholderSpendingLimit(
        secondaryId, owner.serviceId, secondaryId,
        { commandId: randomUUID(), expectedVersion: 1, monthlyLimitMinor: "9999" },
      ),
    ];
    for (const run of denied) {
      await expect(run()).rejects.toMatchObject({ code: "ACTION_DENIED" });
    }

    const own = await getPersonSpending(
      secondaryId, owner.serviceId, secondaryId,
    );
    expect(own).toMatchObject({
      personId: secondaryId,
      monthlyLimit: { minor: "5000" },
      available: { minor: "3000" },
    });
    for (const privateField of ["topups", "people", "source", "sourceLabel"]) {
      expect(own).not.toHaveProperty(privateField);
    }
    await expect(
      getPersonSpending(secondaryId, owner.serviceId, owner.personId),
    ).rejects.toMatchObject({ code: "RESOURCE_UNAVAILABLE" });

    const other = await cardPrimary("Fictional unrelated primary");
    await expect(
      getCardholderTopup(other.personId, other.serviceId, receipt.id),
    ).rejects.toMatchObject({ code: "RESOURCE_UNAVAILABLE" });
    await expect(
      getCardholderFundingIntent(other.personId, other.serviceId, intent.id),
    ).rejects.toMatchObject({ code: "RESOURCE_UNAVAILABLE" });

    expect(await groupBalance(owner.serviceId)).toBe(3000n);
    expect(await topupsFor(owner.serviceId)).toHaveLength(1);
    expect(await limitHistory(owner.serviceId, secondaryId)).toHaveLength(1);
  });

  it("checks current primary authority before confirming or replaying funding", async () => {
    const owner = await cardPrimary("Fictional revoked-funding primary");
    const input = fundingInput("1000");
    await addCardholderFunds(owner.personId, owner.serviceId, input);
    const intent = await prepareCardholderFunding(
      owner.personId, owner.serviceId, fundingInput("2000"),
    );

    await getDb()
      .update(permissionGrants)
      .set({ state: "REVOKED" })
      .where(and(
        eq(permissionGrants.serviceId, owner.serviceId),
        eq(permissionGrants.personId, owner.personId),
        eq(permissionGrants.action, "cardholder.funds.add"),
      ));

    await expect(
      addCardholderFunds(owner.personId, owner.serviceId, input),
    ).rejects.toMatchObject({ code: "ACTION_DENIED" });
    await expect(
      confirmCardholderFunding(owner.personId, owner.serviceId, intent.id),
    ).rejects.toMatchObject({ code: "ACTION_DENIED" });
    expect(await groupBalance(owner.serviceId)).toBe(1000n);
    expect(await topupsFor(owner.serviceId)).toHaveLength(1);
    expect(
      await getCardholderFundingIntent(owner.personId, owner.serviceId, intent.id),
    ).toMatchObject({ receipt: null });
  });

  it("versions person limits and records each accepted change exactly once", async () => {
    const owner = await cardPrimary("Fictional limit-version primary");
    const input = {
      commandId: randomUUID(),
      expectedVersion: 0,
      monthlyLimitMinor: "10000",
    };
    const first = await setCardholderSpendingLimit(
      owner.personId, owner.serviceId, owner.personId, input,
    );
    expect(first).toMatchObject({
      version: 1,
      monthlyLimit: { minor: "10000" },
    });
    expect(
      await setCardholderSpendingLimit(
        owner.personId, owner.serviceId, owner.personId, input,
      ),
    ).toEqual(first);
    expect(await limitHistory(owner.serviceId, owner.personId)).toHaveLength(1);

    await expect(
      setCardholderSpendingLimit(
        owner.personId, owner.serviceId, owner.personId,
        { ...input, monthlyLimitMinor: "10001" },
      ),
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
    await expect(
      setCardholderSpendingLimit(
        owner.personId, owner.serviceId, owner.personId,
        { ...input, commandId: randomUUID(), monthlyLimitMinor: "20000" },
      ),
    ).rejects.toMatchObject({ code: "STALE_VERSION" });

    const second = await setCardholderSpendingLimit(
      owner.personId, owner.serviceId, owner.personId,
      {
        commandId: randomUUID(),
        expectedVersion: first.version,
        monthlyLimitMinor: "15000",
      },
    );
    expect(second).toMatchObject({
      version: 2,
      monthlyLimit: { minor: "15000" },
    });
    expect(
      (await limitHistory(owner.serviceId, owner.personId)).map(row => ({
        version: row.version,
        previous: row.previousMinor,
        next: row.monthlyLimitMinor,
      })),
    ).toEqual([
      { version: 1, previous: 0n, next: 10000n },
      { version: 2, previous: 10000n, next: 15000n },
    ]);
    expect(await groupBalance(owner.serviceId)).toBe(0n);
    expect(await journalsFor(owner.serviceId)).toEqual([]);
  });

  it("allows lowering a limit below spending without resetting usage or moving money", async () => {
    const owner = await cardPrimary("Fictional lowered-limit primary");
    await fundGroup(owner, "20000");
    await setLimit(owner, owner.personId, "10000");
    const { card } = await issueBare(owner);
    const paid = await purchaseCard(owner.personId, owner.serviceId, card.id, {
      commandId: randomUUID(),
      expectedVersion: card.version,
      amountMinor: "6000",
      description: "Fictional purchase before limit change",
    });

    const lowered = await setLimit(owner, owner.personId, "5000");
    expect(lowered).toMatchObject({
      version: 2,
      monthlyLimit: { minor: "5000" },
      spentThisMonth: { minor: "6000" },
      remainingThisMonth: { minor: "0" },
      available: { minor: "0" },
    });
    expect(await groupBalance(owner.serviceId)).toBe(14000n);
    await expect(
      purchaseCard(owner.personId, owner.serviceId, card.id, {
        commandId: randomUUID(),
        expectedVersion: paid.card.version,
        amountMinor: "1",
        description: "Fictional purchase over lowered limit",
      }),
    ).rejects.toMatchObject({ code: "SPENDING_LIMIT_EXCEEDED" });

    const increased = await setLimit(owner, owner.personId, "10000");
    expect(increased).toMatchObject({
      version: 3,
      spentThisMonth: { minor: "6000" },
      remainingThisMonth: { minor: "4000" },
      available: { minor: "4000" },
    });
    expect(await groupBalance(owner.serviceId)).toBe(14000n);
    expect(await journalsFor(owner.serviceId)).toHaveLength(2);
  });

  it("rejects orphan funding journals and mismatched receipts atomically", async () => {
    const owner = await cardPrimary("Fictional funding provenance primary");
    let orphanId = "";
    await expect(rawTransaction(async () => {
      orphanId = await rawFundingJournal(
        owner.serviceId, randomUUID(), 500n, new Date(),
      );
    })).rejects.toMatchObject({
      code: "23514",
      message: "Funding journal needs its top-up receipt",
    });

    let mismatchedId = "";
    await expect(rawTransaction(async () => {
      const receiptId = randomUUID();
      const createdAt = new Date();
      mismatchedId = await rawFundingJournal(
        owner.serviceId, receiptId, 500n, createdAt,
      );
      await raw.query(
        `INSERT INTO cardholder_topups
           (id,"serviceId","actorId","amountMinor","journalId","createdAt")
         VALUES ($1,$2,$3,501,$4,$5)`,
        [receiptId, owner.serviceId, owner.personId, mismatchedId, createdAt],
      );
    })).rejects.toMatchObject({
      code: "23514",
      message: "Financial journal principal and scope must match",
    });

    for (const id of [orphanId, mismatchedId]) {
      expect(
        await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.id, id)),
      ).toEqual([]);
      expect(
        await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.journalId, id)),
      ).toEqual([]);
    }
    expect(await groupBalance(owner.serviceId)).toBe(0n);
    expect(await topupsFor(owner.serviceId)).toEqual([]);
  });

  it("keeps funding intents, receipts, journals and limit history immutable", async () => {
    const owner = await cardPrimary("Fictional immutable-funds primary");
    const intent = await prepareCardholderFunding(
      owner.personId, owner.serviceId, fundingInput("7000"),
    );
    const receipt = await confirmCardholderFunding(
      owner.personId, owner.serviceId, intent.id,
    );
    await setLimit(owner, owner.personId, "5000");
    const [topup] = await topupsFor(owner.serviceId);
    const [history] = await limitHistory(owner.serviceId, owner.personId);
    const before = await getCardholderFunds(owner.personId, owner.serviceId);

    const forbidden: Array<[string, unknown[]]> = [
      ['UPDATE cardholder_topups SET "amountMinor"="amountMinor"+1 WHERE id=$1', [receipt.id]],
      ["DELETE FROM cardholder_topups WHERE id=$1", [receipt.id]],
      ['UPDATE cardholder_funding_intents SET "amountMinor"="amountMinor"+1 WHERE id=$1', [intent.id]],
      ["DELETE FROM cardholder_funding_intents WHERE id=$1", [intent.id]],
      ['UPDATE cardholder_limit_changes SET "monthlyLimitMinor"="monthlyLimitMinor"+1 WHERE id=$1', [history!.id]],
      ["DELETE FROM cardholder_limit_changes WHERE id=$1", [history!.id]],
      ['DELETE FROM cardholder_spending_limits WHERE "serviceId"=$1 AND "personId"=$2', [owner.serviceId, owner.personId]],
      ['UPDATE ledger_journals SET digest=$2 WHERE id=$1', [topup!.journalId, "b".repeat(64)]],
      ["DELETE FROM ledger_journals WHERE id=$1", [topup!.journalId]],
      ['UPDATE ledger_entries SET "deltaMinor"="deltaMinor"+1 WHERE "journalId"=$1', [topup!.journalId]],
      ['DELETE FROM ledger_entries WHERE "journalId"=$1', [topup!.journalId]],
    ];
    for (const [query, values] of forbidden) {
      await expect(raw.query(query, values)).rejects.toMatchObject({ code: "23514" });
    }

    await expect(rawTransaction(async () => {
      await raw.query(
        `UPDATE cardholder_spending_limits
         SET version=version+1,"monthlyLimitMinor"=6000,"updatedAt"=clock_timestamp()
         WHERE "serviceId"=$1 AND "personId"=$2`,
        [owner.serviceId, owner.personId],
      );
    })).rejects.toMatchObject({
      code: "23514",
      message: "Limit change requires matching immutable history",
    });

    expect(
      await getCardholderFunds(owner.personId, owner.serviceId),
    ).toEqual(before);
    expect(
      await getCardholderFundingIntent(owner.personId, owner.serviceId, intent.id),
    ).toMatchObject({ receipt });
    expect(
      await getDb()
        .select()
        .from(cardholderSpendingLimits)
        .where(and(
          eq(cardholderSpendingLimits.serviceId, owner.serviceId),
          eq(cardholderSpendingLimits.personId, owner.personId),
        )),
    ).toMatchObject([{ version: 1, monthlyLimitMinor: 5000n }]);
  });
});
