# Migration notes

## Что изменилось
- добавлены новые каталоги для ideas, research, dispatch, automation и knowledge;
- введена task schema для team mode с orchestration и dispatch полями;
- добавлены русскоязычные templates для задач, исследований, dispatch и Zettelkasten;
- добавлены dashboards для team operations и knowledge boards;
- добавлен `setup-team.sh`;
- добавлен automation scaffolding для DeerFlow/Codex handoff.

## Что осталось совместимым
- текущие `tasks/` и project files продолжают работать;
- `status`, `priority`, `due`, `effort` и прочие базовые поля не ломаются;
- `templates/task-template.md` сохранён как legacy-compatible entrypoint;
- `setup.sh` сохранён для legacy/single-user сценариев;
- `next_id` можно оставить в project files для старых workflows.

## Какие ручные шаги нужны после обновления
- открыть vault в Obsidian и проверить Dataview pages;
- настроить `setup-team.sh` или вручную обновить project files;
- заполнить `repo` и `knowledge_board` для реальных проектов;
- решить, какие repo-level boards действительно нужны;
- проверить slash commands в используемом агентном окружении.

## Какие места требуют проверки командой
- принятые значения `owner` и naming convention по команде;
- структура project/repo knowledge boards;
- правила, по которым DeerFlow переводит задачу в `dispatch_ready`;
- уровень доступа DeerFlow и Codex на сервере;
- готовность существующих automation-процессов перейти с legacy `next_id` на scan-based ID generation.
