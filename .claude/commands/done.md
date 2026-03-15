Завершить задачу или отметить окончание execution stage.

Сначала прочитай `AGENTS.md` и `docs/codex-execution-workflow.md`.

## Использование

`/done <task-id или search-term> [--actual <duration>]`

## Логика
1. Найди задачу по `id` или по заголовку в `tasks/`.
2. Обнови:
   - `status: done`
   - `completed: <сегодня>`
   - `handoff_status: done`, если execution cycle завершён
   - `actual`, если передано
3. Добавь запись в журнал.
4. Проверь, есть ли другие задачи с зависимостью через `blocked_by`.
5. Не закрывай автоматически связанные dispatch/research notes; только сообщи о них пользователю.
