# Tailscale — защищённый ввод секретов через Control UI

<!-- project: github.com/devgrav/johnny-assistant-ai -->

Статус: ВЫПОЛНЕНО 2026-10-08 (serve поднят).

## Итог

- Serve включён на уровне тайлнета (capabilities `funnel-ports`).
- `gateway.tailscale.mode: serve` — активен, рестарт прошёл чисто.
- `https://ams-1-vm-gwgs.taila42df5.ts.net/` → 200, `[tailscale] serve enabled`.
- Watchdog: arm → успех → disarm.

## Цель (была)

Дать Andrey возможность передавать секреты (токены ботов, API-ключи) через Control UI
по маскированному полю. Для этого Control UI должен открываться по HTTPS из тайлнета —
через Tailscale Serve.

## Почему упало в прошлый раз (шаг 4)

Не Tailscale, а гонка hot-reload при рестарте (`prepared model runtime plugin generation
was superseded`). Решено: конфиг + рестарт одним атомарным ходом через инструмент `openclaw`,
не через hot-reload из exec.

## Дальше

Andrey открывает Control UI по HTTPS и вводит секреты (токен бота финконсультанта,
Snowball-ключ и т.д.) через маскированное поле.
