# Codex execution workflow

## Роль Codex
Codex — execution layer. Он не должен принимать самостоятельные продуктовые решения и не должен подменять DeerFlow.

## Какие задачи можно отдавать Codex
- implement-ready feature work;
- точечные bugfix;
- patch work;
- ограниченный refactor;
- тестирование и проверка в рамках подготовленного scope.

## Какие задачи нельзя отдавать Codex
- raw ideas;
- задачи без triage;
- research-first задачи;
- задачи без выбранного репозитория;
- задачи без acceptance criteria;
- задачи без dispatch note;
- knowledge capture без явного execution scope.

## Что DeerFlow обязан подготовить
- определить `repo`;
- выбрать `codex_mode`;
- зафиксировать acceptance criteria;
- добавить execution constraints;
- приложить research summary и ссылки на knowledge notes;
- создать dispatch note;
- перевести задачу в `dispatch_ready: true`.

## Режимы Codex
- `implement` — реализовать новую функциональность в заданном scope.
- `patch` — внести точечную правку с минимальным surface area.
- `refactor` — улучшить структуру без изменения согласованного поведения.
- `test` — добавить или обновить проверки, воспроизвести и подтвердить результат.

## Что должен вернуть Codex
- краткое summary изменений;
- список изменённых файлов;
- результаты проверки или тестов;
- отмеченные риски и ограничения;
- предложения для human review, если есть сомнения.

## Что должен проверить человек перед merge/deploy
- соответствует ли результат acceptance criteria;
- не изменился ли scope без согласования;
- достаточно ли покрытие тестами;
- нет ли скрытых infra/security рисков;
- готова ли задача к merge/deploy в целевой репозиторий.

## Жёсткое правило
Codex не исполняет задачи из `ideas/`, `research/` или `knowledge/inbox/` без явного dispatch.
