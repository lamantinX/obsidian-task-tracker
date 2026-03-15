# Obsidian Task Tracker для команды

Русскоязычный markdown-first vault для небольшой инженерной команды.

## Архитектурная модель
- Obsidian vault = central control plane
- DeerFlow = central brain / orchestration / research layer
- Codex = code execution layer
- Zettelkasten = общая база знаний команды

## Что хранится в vault
- `tasks/` — задачи по проектам
- `ideas/` — быстрый capture идей
- `research/` — research notes и обоснования
- `dispatch/` — явные handoff-пакеты
- `knowledge/` — командная база знаний в стиле Zettelkasten
- `projects/` — mapping проекта к репозиторию и knowledge board
- `dashboard.md` и `dashboards/` — Dataview-страницы для ежедневной работы

## Основные правила
- DeerFlow занимается triage, research, decomposition, planning и routing.
- Codex не принимает самостоятельных продуктовых решений.
- Никакая задача не должна исполняться без явного dispatch.
- Production access не должен быть открыт DeerFlow и Codex по умолчанию.

## Идентификаторы
Для team mode используется формат:

`<PROJECT_PREFIX>-<YYYYMMDD>-<NN>`

Пример:

`APP-20260315-01`

`next_id` сохраняется только для legacy-совместимости.

## База знаний
В `knowledge/` хранится командный Zettelkasten:
- `knowledge/inbox/` — входящие знания
- `knowledge/notes/` — permanent и literature notes
- `knowledge/structures/` — structure notes / MOC
- `knowledge/projects/` — доски знаний по проектам
- `knowledge/repos/` — доски знаний по репозиториям

Главный вход: [[knowledge/knowledge-hub]]

## Инициализация
- `./setup.sh` — legacy single-user setup
- `./setup-team.sh` — основной setup для командного режима

## Automation scaffolding
В `automation/` лежат shell-скрипты для подготовки handoff:
- `triage-task.sh`
- `research-task.sh`
- `plan-task.sh`
- `dispatch-to-codex.sh`
- `capture-zettel.sh`
- `link-zettel-board.sh`

Они валидируют frontmatter, печатают summary и готовят structured prompt, но не запускают autonomous loop.

## Главные страницы
- [[dashboard|Главный dashboard]]
- [[knowledge/knowledge-hub|Хаб базы знаний]]
- [[docs/task-schema|Схема задач]]
- [[docs/deerflow-orchestration-workflow|DeerFlow workflow]]
- [[docs/codex-execution-workflow|Codex workflow]]
- [[docs/server-deployment|Серверный сценарий]]
- [[docs/migration-notes|Migration notes]]
