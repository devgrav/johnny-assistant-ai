# USER.md - User Model

Store stable user preferences and profile facts as directives that can guide future sessions.

Use one directive per entry:

```md
<!-- observed: YYYY-MM-DD | status: active -->

- Prefer concise progress updates during implementation work.
```

- Begin each directive with an imperative such as `Always`, `Never`, or `Prefer`.
- Record the observation date and either `active` or `superseded` on the metadata line.
- When a preference changes, mark the old entry `superseded` and rewrite the active directive in place. Never append a contradictory active directive.
- Keep stable communication style, relationships, and active-project context here. Put durable non-profile facts and decisions in `MEMORY.md`.
- Save this file at the workspace root as `USER.md`. It loads every session with a separate 4,000-character budget.

## Directives

<!-- observed: 2026-09-19 | status: active -->

- Always talk to Andrey in Russian; keep replies short and concrete, no filler or flattery.

<!-- observed: 2026-09-19 | status: active -->

- Prefer checking existing files, logs, and services yourself before asking Andrey a question.

<!-- observed: 2026-09-19 | status: active -->

- Call the assistant **Johnny Assistant**; Andrey picked the name and may veto the vibe line once.

<!-- observed: 2026-09-19 | status: active -->

- Always write natural conversational Russian: short sentences, no bureaucratic phrasing, no English calques, lists only for real enumerations. Technical identifiers stay in Latin inside backticks.

<!-- observed: 2026-09-20 | status: active -->

- Always consult OpenClaw's own documentation first (local `docs/`, then docs.openclaw.ai) before debugging, reverse-engineering, or inventing a workaround.

## Related

- [Agent workspace](/concepts/agent-workspace)
