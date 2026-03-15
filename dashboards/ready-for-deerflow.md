# Готово для DeerFlow

```dataview
TABLE project as "Проект", kind as "Тип", owner as "Владелец", deerflow_mode as "Режим", handoff_status as "Этап"
FROM "tasks"
WHERE executor = "deerflow" AND (handoff_status = "inbox" OR handoff_status = "triaged" OR orchestration_status = "queued")
SORT priority ASC, created DESC
```
