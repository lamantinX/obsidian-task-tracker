# Заблокировано

```dataview
TABLE project as "Проект", owner as "Владелец", executor as "Исполнитель", blocked_by as "Блокеры", due as "Срок"
FROM "tasks"
WHERE status = "blocked" OR handoff_status = "blocked"
SORT due ASC
```
