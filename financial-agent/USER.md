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

<!-- observed: 2026-10-09 | status: active -->
- Базовая цель (предварительная): пассивный доход около 200 000 ₽/месяц через 5 лет (горизонт ~2031). Актуальные цели и цифры сверить из Snowball после подключения.

<!-- observed: 2026-10-09 | status: active -->
- Портфель должен быть диверсифицированным; грамотная диверсификация — обязательное условие любой рекомендации.

<!-- observed: 2026-10-09 | status: active -->
- Риск-профиль: умеренный, ближе к консервативному.

<!-- observed: 2026-10-09 | status: active -->
- Толерантность к риску высокая: Andrey спокойно переживает приличные просадки, но только при условии грамотной диверсификации.

<!-- observed: 2026-10-09 | status: active -->
- Детали профиля (свободный кэш, подушка, состав портфеля, уточнение целей) дописать после анализа портфеля капитала в Snowball.
