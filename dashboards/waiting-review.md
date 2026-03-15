# Ожидает ревью

```dataview
TABLE project as "Проект", owner as "Владелец", executor as "Исполнитель", repo as "Репозиторий", handoff_status as "Этап"
FROM "tasks"
WHERE handoff_status = "reviewing"
SORT created DESC
```
