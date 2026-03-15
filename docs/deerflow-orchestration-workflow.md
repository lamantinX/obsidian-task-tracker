# DeerFlow orchestration workflow

## Роль DeerFlow
DeerFlow — центральный orchestration brain. Он не ограничивается coding-задачами и отвечает за:
- triage входящих идей и задач;
- research;
- decomposition;
- planning;
- routing на человека или Codex;
- synthesis и связывание knowledge notes.

## Что нужно отправлять в DeerFlow
- сырые идеи;
- неясные баги;
- задачи, требующие research;
- запросы на декомпозицию;
- планирование feature/ops work;
- материалы из knowledge inbox, которые нужно превратить в структурированные заметки.

## Что нельзя отправлять напрямую в Codex
- untriaged ideas;
- research requests;
- product discovery;
- спорные архитектурные решения без recommendation;
- задачи без определённого `repo`;
- задачи без acceptance criteria и execution constraints;
- всё, что не прошло явный dispatch.

## Этапы DeerFlow
### 1. Triage
- вход: `handoff_status: inbox`, `deerflow_mode: triage`
- выход: определить `kind`, владельца, executor и следующий шаг
- обновления:
  - `handoff_status: triaged`
  - `orchestration_status: completed`

### 2. Research
- вход: задача или идея с вопросами и рисками
- DeerFlow оформляет или обновляет research note
- обновления:
  - `handoff_status: researching`
  - `orchestration_status: in_progress`
  - `related_research` получает ссылки на research notes

### 3. Decompose
- DeerFlow раскладывает идею на задачи и knowledge artifacts
- обновления:
  - создаются задачи и при необходимости dispatch notes
  - knowledge notes связываются через `related_notes`

### 4. Plan
- DeerFlow готовит чёткий execution-ready scope
- обновления:
  - `handoff_status: planning`
  - `deerflow_mode: plan`

### 5. Route
- DeerFlow выбирает исполнителя:
  - `human`, если требуется ручное решение, review или нефункциональная координация;
  - `codex`, если задача чёткая и execution-ready.
- обновления:
  - `executor`
  - `repo`
  - `codex_mode`
  - `dispatch_ready`

## Условие handoff в Codex
Задача может уйти в Codex только если одновременно выполнены условия:
- `executor: codex`
- `dispatch_ready: true`
- `handoff_status: ready` или `dispatched`
- существует dispatch note в `dispatch/`
- указан `repo`
- заполнены acceptance criteria
- заполнены execution constraints
- research и knowledge links приложены, если они нужны для исполнения

## Что DeerFlow должен оставлять после себя
- ясный task scope;
- research summary;
- ссылки на связанные knowledge notes;
- dispatch packet для Codex или человека;
- статусную запись в журнале задачи.
