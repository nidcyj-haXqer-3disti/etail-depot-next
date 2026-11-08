# Issuing and real mock-event completion

Target: M3.

Continue using the one card/facility/policy system. Implement authorization, holds, settlement, reversals, repayments, restrictions, statements, funded supervised access and membership-attributed rewards. Use atomic shared backing and usage counters. Distinguish collateral/obligation/available; enforce no payout/pledge double use. A member sees one Make a practice purchase action; mock provider events use the same durable inbox/outbox and common handlers. No manual Clear/Finish button in the member journey. Delayed events show Pending honestly. Freeze denies new authorization but does not erase valid late settlement. Enable only the bounded simulation runner after tests, not every schedule. Run all money/reward/concurrency fixtures and reload-persistence browser tests. Do not turn on real-money providers.

At task end update `planning/STATUS.md` and the affected acceptance evidence. Say exactly what is implemented, tested, blocked, merged and deployed. Never infer one from another.
