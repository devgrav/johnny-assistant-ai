# Tailscale — защищённый ввод секретов через Control UI

<!-- project: github.com/devgrav/johnny-assistant-ai -->

Статус: план (не выполнен). Дата: 2026-10-08.

## Цель

Дать Andrey возможность передавать секреты (токены ботов, API-ключи) через Control UI
по маскированному полю. Для этого Control UI должен открываться по HTTPS из тайлнета —
через Tailscale Serve. Сейчас панель доступна только на loopback (`http://127.0.0.1:18789`),
а секреты нельзя вводить по открытому HTTP.

## Текущее состояние (проверено 2026-10-08)

- Tailscale на сервере установлен и залогинен: узел `ams-1-vm-gwgs`, IP `100.113.138.31`,
  аккаунт `devgrav@`.
- MagicDNS включён: DNSName `ams-1-vm-gwgs.taila42df5.ts.net` резолвится.
- `gateway.tailscale` = `{ "mode": "off" }` — serve ещё не включён.
- `gateway.publicOrigin` = `https://ams-1-vm-gwgs.taila42df5.ts.net` — УЖЕ прописан,
  но при `mode: off` это мёртвые ссылки (gotcha из AGENTS.md).
- `tailscale serve status` → `No serve config`, порт 443 не слушается.
- Операторские права: `tailscale set --operator=openclaw` выданы.

## Почему упало в прошлый раз (шаг 4)

Не Tailscale. Конфиг (`mode: serve` + `publicOrigin`) записали, но рестарт гейтвея
через штатный инструмент дважды упал с ошибкой
`prepared model runtime plugin generation was superseded` — гонка hot-reload:
runtime пересоздался, и отдельный ход рестарта не смог подготовиться. Сам serve
так и не активировался (статус «No serve config»). Т.е. проблема была в способе
рестарта, а не в Tailscale.

Урок: применять `mode: serve` и рестарт одним атомарным ходом (через инструмент
`openclaw`, не через hot-reload из exec), либо рестарт владельцем через
`openclaw gateway restart`.

## Пререквизиты (проверить ДО включения)

1. **Tailscale Serve включён на уровне тайлнета.** Админ-консоль →
   https://login.tailscale.com/f/serve . Если выключен — гейтвей hard-fail на старте
   с `Serve is not enabled on your tailnet` и crash-loop каждые ~30с (gotcha из AGENTS.md).
2. **MagicDNS** — уже включён (подтверждено DNSName).
3. **HTTPS-сертификаты** — включены по умолчанию, проверить в DNS → HTTPS.

## Шаги (порядок)

1. Проверить п.1 пререквизитов (Serve на уровне тайлнета). Без этого не двигаться.
2. Снапшот конфига: `git add` + `~/.openclaw/watchdog/guard.sh arm` (armed-режим).
3. Атомарно выставить конфиг + рестарт через инструмент `openclaw` (не через
   hot-reload из exec): `gateway.tailscale.mode: serve`. `publicOrigin` уже верный.
4. Проверить: `tailscale serve status` показывает route на `127.0.0.1:18789`,
   `https://ams-1-vm-gwgs.taila42df5.ts.net/` отдаёт Control UI, гейтвей остался на loopback.
5. Убедиться, что гейтвей не ушёл в crash-loop: `systemctl --user status openclaw-gateway`.
6. Снять watchdog: `guard.sh disarm`.

## Откат

- Вернуть `gateway.tailscale.mode: off` тем же атомарным путём.
- Если crash-loop — watchdog сам откатит на `last-good.openclaw.json`; иначе вручную:
  `systemctl --user restart openclaw-gateway` после отката конфига.
- `publicOrigin` при `mode: off` держать не надо — это мёртвые ссылки.

## Дальше после serve

В Control UI появится ссылка на панель по HTTPS. Через неё Andrey вводит секреты
(маскированное поле) — токен бота финконсультанта, Snowball-ключ и т.д.
