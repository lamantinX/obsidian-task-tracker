# Схема задач для team mode

## Цель
Новая схема сохраняет совместимость с текущими markdown-зачами и добавляет поля для orchestration, handoff и knowledge linking.

## Обязательные базовые поля
- `id`
- `title`
- `status`
- `project`
- `priority`
- `created`

## Совместимые существующие поля
- `due`
- `tags`
- `completed`
- `blocked_by`
- `effort`
- `actual`

## Новые поля team mode
- `owner` — ответственный человек или роль.
- `executor` — `human | deerflow | codex`.
- `kind` — `idea | research | feature | bug | ops | chore`.
- `repo` — абсолютный путь к репозиторию или пустое значение.
- `handoff_status` — `inbox | triaged | ready | dispatched | researching | planning | implementing | reviewing | done | blocked`.
- `orchestration_status` — `none | queued | in_progress | completed | failed`.
- `deerflow_mode` — `none | triage | research | decompose | plan | route`.
- `codex_mode` — `none | implement | patch | refactor | test`.
- `related_research` — список ссылок на research notes.
- `dispatch_ready` — `true | false`.
- `related_notes` — список ссылок на knowledge notes.

## Значения по умолчанию для новых задач
```yaml
owner:
executor: human
kind: chore
repo:
handoff_status: inbox
orchestration_status: none
deerflow_mode: none
codex_mode: none
related_research: []
dispatch_ready: false
related_notes: []
```

## Разделение уровней статуса
- `status` — рабочее состояние задачи для людей: `todo | in-progress | done | blocked | cancelled`.
- `handoff_status` — положение задачи в pipeline handoff.
- `orchestration_status` — состояние работы DeerFlow.
- `deerflow_mode` и `codex_mode` — режим, в котором агент должен работать.

## Идентификаторы
Для новых задач в team mode используется формат:

`<PROJECT_PREFIX>-<YYYYMMDD>-<NN>`

Пример:

`APP-20260315-01`

### Генерация
- брать `id_prefix` из `projects/<project>.md`;
- искать существующие файлы по тому же проекту и дате;
- выбирать следующий свободный двухзначный суффикс `NN`;
- не использовать общий mutable `next_id` как основной механизм.

## Legacy-совместимость
- старые задачи без новых полей остаются валидными;
- `next_id` может храниться в project files только как legacy-mode;
- dashboards и automation должны уметь читать как новую, так и legacy-схему.
