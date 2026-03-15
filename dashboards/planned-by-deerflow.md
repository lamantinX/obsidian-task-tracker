# Спланировано DeerFlow

```dataview
TABLE project as "Проект", owner as "Владелец", handoff_status as "Этап", orchestration_status as "Orchestration", dispatch_ready as "Готово к dispatch"
FROM "tasks"
WHERE deerflow_mode = "plan" OR handoff_status = "planning"
SORT created DESC
```
