# Готово для Codex

```dataview
TABLE project as "Проект", owner as "Владелец", repo as "Репозиторий", codex_mode as "Режим Codex", handoff_status as "Этап"
FROM "tasks"
WHERE executor = "codex" AND dispatch_ready = true AND (handoff_status = "ready" OR handoff_status = "dispatched")
SORT priority ASC, created DESC
```
