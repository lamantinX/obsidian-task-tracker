# Активное по проекту

```dataview
TABLE WITHOUT ID
  project as "Проект",
  length(rows) as "Всего",
  length(filter(rows, (r) => r.executor = "deerflow")) as "DeerFlow",
  length(filter(rows, (r) => r.executor = "codex")) as "Codex",
  length(filter(rows, (r) => r.status = "in-progress")) as "В работе",
  length(filter(rows, (r) => r.status = "blocked" OR r.handoff_status = "blocked")) as "Заблокировано"
FROM "tasks"
WHERE file.name != "README" AND status != "done" AND status != "cancelled"
GROUP BY project
SORT project ASC
```
