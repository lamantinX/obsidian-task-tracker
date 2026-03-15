# Входящие идеи

```dataview
TABLE project as "Проект", owner as "Владелец", priority as "Приоритет", created as "Создано", handoff_status as "Handoff"
FROM "ideas"
WHERE file.name != "README"
SORT created DESC
```
