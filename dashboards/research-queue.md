# Очередь research

```dataview
TABLE project as "Проект", owner as "Владелец", deerflow_mode as "Режим DeerFlow", handoff_status as "Этап", created as "Создано"
FROM "research"
WHERE file.name != "README"
SORT created DESC
```
