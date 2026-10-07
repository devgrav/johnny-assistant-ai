# MEMORY.md — Durable Facts & Decisions

<!-- project: path:/home/openclaw/.openclaw/workspace -->

## Инфраструктура (2026-10-07)

- **Модели:** primary `deepseek/deepseek-v4-pro`, image + utility = `deepseek/deepseek-flash`, fallback = `deepseek/deepseek-v4-pro`. Доступ — api-key профиль `deepseek:setup-…`.
- **Tutu MCP:** подключён, `mcp.servers.tutu`, Streamable HTTP без авторизации, 17 инструментов.
- **Следилка за балансом:** automation `fe6e07c6-11f3-466a-a52d-984896eb3ba2` — раз в 4 часа проверяет баланс DeepSeek (`openclaw status --usage --json`), шлёт в Telegram при < $3. Скрипт без модели.
- **Git:** репо `git@github.com:devgrav/johnny-assistant-ai.git` (приватное), ветка `master`. Правило: коммит = сразу push. `node_modules/` в `.gitignore`.
- **Оптимизация токенов (2026-10-07):** `heartbeat.model` = flash, `heartbeat.every` = `2h`, `model.fallbacks` = flash, `compaction.maxActiveTranscriptBytes` = `800kb` (~200k токенов), `thinkingDefault` = `low`. Правка через `openclaw config patch --stdin` / `config set` (merge), hot-reload, бэкап `openclaw.json.bak.*`. Primary остаётся pro: flash заметно хуже на русском (решение Andrey). Рекомендовано: hard-limit в ЛК DeepSeek (у ассистента доступа нет).

## Решения и уроки

- **Цены DeepSeek:** pro $0.66 вход / $1.98 выход за 1M (оффпик), flash $0.15 / $0.60; пиковые часы ×2.
- **Утечка токенов (2026-10-07):** долгоживущая сессия (контекст 560k) + pro-модель + heartbeat каждые 30 мин = счёт ~$0.3–0.4 за ход. Способы: свежие сессии, flash по умолчанию (pro по требованию), замедлить heartbeat, резать гигантские выдачи инструментов, держать стабильный префикс ради кэша.
- **Проект личных ассистентов:** см. USER.md (активный проект). Фитнес-агент = объединённый «здоровье + тренировки + питание» с импортом Huawei (5 лет) и FatSecret (7 лет). Психолог → CBT-компаньон. Оба отложены до аудита данных.
- **Напоминания на этом хосте:** изолированные, скрипт-пейлоад + `delivery.mode: none`, аккаунт канала `default` (детали в AGENTS.md).
