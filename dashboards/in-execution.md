# В исполнении

```dataview
TABLE project as "Проект", owner as "Владелец", executor as "Исполнитель", codex_mode as "Режим Codex", status as "Статус", handoff_status as "Этап"
FROM "tasks"
WHERE status = "in-progress" OR handoff_status = "implementing"
SORT created DESC
```
