# Активное по владельцу

```dataview
TABLE WITHOUT ID
  owner as "Владелец",
  length(rows) as "Всего",
  length(filter(rows, (r) => r.status = "todo")) as "Todo",
  length(filter(rows, (r) => r.status = "in-progress")) as "В работе",
  length(filter(rows, (r) => r.handoff_status = "reviewing")) as "На ревью",
  length(filter(rows, (r) => r.status = "blocked" OR r.handoff_status = "blocked")) as "Заблокировано"
FROM "tasks"
WHERE file.name != "README" AND status != "done" AND status != "cancelled"
GROUP BY owner
SORT owner ASC
```
