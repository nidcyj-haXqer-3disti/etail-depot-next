# Video review and Etail planning response

11 September 2026 · D63 · Requested by the product owner.

Source: [Asian Dad Energy — I Replaced Claude With Chinese AI?](https://www.youtube.com/watch?v=hl5r2vAzCb0), published 9 September 2026, duration 18:10.

## Coverage and prompt limitation

Read the complete available English auto-caption transcript, 0:00–18:08, and full description. Visually sampled the design/build discussion at 8:43, 8:48, 8:58, 9:03, 9:13, 11:58, 12:03 and 12:18. This is a full-transcript review with targeted visual inspection, not a claim to have watched every frame. No separate complete prompt/specification file was recovered from the visible description or exact-video/creator search. The prompts below are paraphrases, not verbatim recovered text.

## What the video contributes

| Segment | Review notes |
|---|---|
| [0:00–3:32](https://www.youtube.com/watch?v=hl5r2vAzCb0&t=0s) | A personal link-page problem defines a small product; model selection follows. |
| [3:32–8:28](https://www.youtube.com/watch?v=hl5r2vAzCb0&t=212s) | Access, context management, tools, skills and harness selection. |
| [8:28–11:16](https://www.youtube.com/watch?v=hl5r2vAzCb0&t=508s) | Design first; challenge analytics/database choices and maintenance burden. |
| [11:16–13:02](https://www.youtube.com/watch?v=hl5r2vAzCb0&t=676s) | Phased implementation and tests; interrupted agent runs. |
| [13:02–15:18](https://www.youtube.com/watch?v=hl5r2vAzCb0&t=782s) | Code review, human inspection, manual testing and debugging before deployment. |
| [15:18–18:10](https://www.youtube.com/watch?v=hl5r2vAzCb0&t=918s) | Personal model/cost assessment and conclusion, not an independent benchmark. |

**Design prompt, paraphrased:** specify the application from user needs, address scalability and solo maintenance, and raise technical/functional questions. **Build prompt, paraphrased:** implement the specification in phases with unit/important-flow tests, fix failures and iterate. [Design](https://www.youtube.com/watch?v=hl5r2vAzCb0&t=508s), [implementation](https://www.youtube.com/watch?v=hl5r2vAzCb0&t=676s).

## Our assessment of Etail Depot

We had substantial planning material, but let its authority drift while reacting to individual screens and failures. The mandatory master prompt still required retired account structures; the implementation had already moved to two services. Some historical documents described unbuilt behavior as the next executable mandate, while test/deployment summaries were too easy to confuse with successful customer acceptance.

This is our repository audit, not a claim made by the video. Three source-confirmed experience gaps need explicit design: the accepted secondary with no card, primary merchant network/period drilldown, and merchant payment support through an assigned operator. The existing financial engine is a synchronous practice sandbox; guest checkout, external channel delivery, durable provider processing and full payment exceptions remain incomplete. Successful local authentication harnesses and unauthenticated hosted checks have not established the user's actual hosted mailbox/password roundtrip.

We should retain the current Next.js/managed PostgreSQL architecture, scope controls and ledger unless a demonstrated limitation justifies replacement. Changing vendors now would add identity/data migration work without resolving these acceptance gaps. No claim about the video's model quality, cost or small-project speed supplies a schedule for this product.

## Concrete changes made in this task

- Replaced the active master prompt with an original, design-first Etail prompt and removed the three-account implementation mandate.
- Created one [product/technical specification](../PRODUCT_TECHNICAL_DESIGN.md): agreed model, role matrix, navigation/layout requirements, complete journeys, current ERD/states, owners, invariants, gaps and open decisions.
- Created one [dependency-ordered delivery plan](../../planning/DELIVERY_PLAN.md), beginning with design review and hosted entry acceptance; complete-product scope remains explicit.
- Reconciled entry documents/source precedence and marked older model/status documents historical. Preserved original economics, source workbooks, requirement IDs and delivery evidence.
- Kept application code, records, dependencies, providers and deployment unchanged. The next output is an annotated connected design walkthrough, followed by implementation of reviewed slices.

## Prompt to use for Etail

Use [02_MASTER_BUILD_PROMPT.md](../../02_MASTER_BUILD_PROMPT.md). It is an original project-specific adaptation. It directs the agent to establish the product contract, four customer-role journeys, operator recovery, state/data/permission design and acceptance before more implementation. It also identifies the existing architecture to preserve and the material decisions still open. It does not assert possession of the creator's full original prompt.
