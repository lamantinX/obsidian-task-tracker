Создать новую задачу или идею в team mode.

Сначала прочитай `AGENTS.md` и `docs/task-schema.md`.

## Использование

`/task <title> --project <project> [--kind <idea|research|feature|bug|ops|chore>] [--priority <high|medium|low>] [--owner <name>] [--executor <human|deerflow|codex>] [--due YYYY-MM-DD]`

## Логика
1. Прочитай `projects/<project>.md`.
2. Возьми `id_prefix`.
3. Сгенерируй ID в формате `<PREFIX>-<YYYYMMDD>-<NN>` через сканирование существующих файлов по этому проекту и сегодняшней дате.
4. Создай файл:
   - `ideas/<slug>.md`, если `kind=idea`
   - `research/<slug>.md`, если `kind=research`
   - `tasks/<project>/<slug>.md` для остальных случаев
5. Используй team-mode frontmatter из `templates/task.md` или `templates/idea.md`.
6. Если `executor=codex`, не ставь `dispatch_ready: true` автоматически.
7. Добавь запись в журнал о создании.

## Правила
- Не использовать `next_id` как основной источник ID.
- По умолчанию направляй неясные задачи в DeerFlow.
- Если это raw idea, не отправляй её напрямую в Codex.
