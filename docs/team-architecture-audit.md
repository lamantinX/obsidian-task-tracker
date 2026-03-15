# Аудит текущей архитектуры vault

## Что уже есть
- `tasks/` — по одной markdown-задаче на файл, разложено по проектам.
- `projects/` — индексные файлы проектов с `repo`, `id_prefix` и legacy `next_id`.
- `archive/` — каталог для завершённых или вынесенных задач, но в текущей версии почти не задействован.
- `dashboard.md` — Dataview-дашборд для single-user task tracking.
- `CLAUDE.md` — тонкий compatibility entrypoint с отсылкой на `AGENTS.md`.
- `.claude/commands/` — slash commands для Claude-centric workflow.
- `setup.sh` — интерактивная инициализация single-user структуры.
- `analytics/` — burndown log.
- `daily/` и `weekly/` — периодические заметки и planning/review слой.

## Что ограничивает командный сценарий
- Основной workflow ориентирован на одного человека и Claude commands.
- Создание задач завязано на mutable `next_id`, что рискованно для команды.
- Нет явного слоя handoff между idea, research, orchestration и execution.
- Нет выделенной базы знаний и досок Zettelkasten по проектам/репозиториям.
- Нет централизованной модели dispatch в DeerFlow и дальнейшего handoff в Codex.
- Dashboards отражают только обычные task-статусы и не показывают agentic workflow.

## Вывод
Текущая база уже хорошо подходит как markdown-first control plane, но её нужно расширить до командной модели:
- сохранить простые markdown и Dataview-паттерны;
- отделить orchestration от execution;
- добавить knowledge layer;
- формализовать dispatch и routing;
- ослабить зависимость от `next_id`.
