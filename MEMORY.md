# MEMORY.md — Durable Facts & Decisions

<!-- project: path:/home/openclaw/.openclaw/workspace -->

## Инфраструктура (2026-10-07)

- **Модели:** primary `deepseek/deepseek-v4-pro`, image + utility = `deepseek/deepseek-flash`, fallback = `deepseek/deepseek-v4-pro`. Доступ — api-key профиль `deepseek:setup-…`.
- **Tutu MCP:** подключён, `mcp.servers.tutu`, Streamable HTTP без авторизации, 17 инструментов.
- **Следилка за балансом:** automation `fe6e07c6-11f3-466a-a52d-984896eb3ba2` — раз в 4 часа проверяет баланс DeepSeek (`openclaw status --usage --json`), шлёт в Telegram при < $3. Скрипт без модели.
- **Git:** репо `git@github.com:devgrav/johnny-assistant-ai.git` (приватное), ветка `master`. Правило: коммит = сразу push. `node_modules/` в `.gitignore`.
- **Оптимизация токенов (2026-10-07):** `heartbeat.model` = flash, `heartbeat.every` = `2h`, `model.fallbacks` = flash, `compaction.maxActiveTranscriptBytes` = `800kb` (~200k токенов), `thinkingDefault` = `low`. Правка через `openclaw config patch --stdin` / `config set` (merge), hot-reload, бэкап `openclaw.json.bak.*`. Primary остаётся pro: flash заметно хуже на русском (решение Andrey). Рекомендовано: hard-limit в ЛК DeepSeek (у ассистента доступа нет).

## Инфраструктура (2026-10-08)

- **Watchdog config-edit (armed mode):** `~/.openclaw/watchdog/{watchdog.sh,guard.sh,last-good.openclaw.json,watchdog.log,backups/}`. Таймер `openclaw-watchdog.timer` отключён из автозапуска (`disabled`), дежурит только пока снят armed-флаг. Ловит падение (`unit != active`) и зависание (юнит `active`, порт 18789 молчит). 2 фейла подряд → бэкап битого конфига → откат на `last-good.openclaw.json` → рестарт → auto-disarm. Cooldown 10 мин, armed TTL 30 мин. Процесс: `guard.sh arm` → правка/проверка → `guard.sh disarm`. Проверено live (откат ~80с) и dry-run зависания.
- **Ежемесячная проверка обновлений OpenClaw:** automation (cron `0 9 1 * *` tz Europe/Moscow, isolated agentTurn) — сверяет текущую версию с npm latest, при новой версии шлёт сводку фич + потенциальные проблемы + план обновления с бекапами. Доставка announce → telegram `438449705`.

## Решения и уроки

- **Цены DeepSeek:** pro $0.66 вход / $1.98 выход за 1M (оффпик), flash $0.15 / $0.60; пиковые часы ×2.
- **Утечка токенов (2026-10-07):** долгоживущая сессия (контекст 560k) + pro-модель + heartbeat каждые 30 мин = счёт ~$0.3–0.4 за ход. Способы: свежие сессии, flash по умолчанию (pro по требованию), замедлить heartbeat, резать гигантские выдачи инструментов, держать стабильный префикс ради кэша.
- **Проект личных ассистентов:** см. USER.md (активный проект). Фитнес-агент = объединённый «здоровье + тренировки + питание» с импортом Huawei (5 лет) и FatSecret (7 лет). Психолог → CBT-компаньон. Оба отложены до аудита данных.
- **Финансовый агент (в работе, 2026-10-07):** советник-аналитик для консервативного инвестора, не трейдер. Помогает принимать решения (квартира под аренду, облигации, фонды, куда направить кэш) на основе реального портфеля/целей/профиля Andrey. Read-only по умолчанию, записи только с явного подтверждения. **Приватность НЕ критична (решение Andrey) → облако DeepSeek pro, без VPS-обвязки.** Слой критики = собственный скилл `financial-agent/skills/financial-critic/SKILL.md`. Модель-сравнение зафиксировано в `assistants/PLAN.md`.
- **Snowball Income MCP:** официальный сервер `https://snowball-income.com/mcp-server` (Streamable HTTP), read-only. Авторизация: заголовок `X-API-Key` с ключом, либо ключ в пути URL `/k/<ключ>` (auth=None). Тариф **Эксперт**. Ключ генерится один раз во вкладке MCP профиля, показывается один раз, восстановить нельзя (перегенерация отзывает старый). Портфели, целевые доли, сделки, дивиденды, прогноз цели — всё read-only.
- **Напоминания на этом хосте:** изолированные, скрипт-пейлоад + `delivery.mode: none`, аккаунт канала `default` (детали в AGENTS.md).
