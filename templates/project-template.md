---
project: <% tp.file.title %>
full_name:
repo:
remote:
status: active
started: <% tp.date.now("YYYY-MM-DD") %>
color:
id_prefix:
knowledge_board: knowledge/projects/<% tp.file.title %>/index
next_id: 1
---

# <% tp.file.title %>

> `next_id` сохранён только для legacy-совместимости. Для новых team-mode сущностей используйте scan-based ID в формате `<PREFIX>-<YYYYMMDD>-<NN>`.

## Репозиторий

`repo path not set`

## Доска знаний

- [[knowledge/projects/<% tp.file.title %>/index|Доска знаний проекта]]

## Активные задачи

```dataview
TABLE status, priority, due, effort
FROM "tasks/<% tp.file.title %>"
WHERE status != "done" AND status != "cancelled"
SORT choice(priority, "high", 1, "medium", 2, "low", 3) ASC, due ASC
```

## Недавно завершённые

```dataview
TABLE completed, actual
FROM "tasks/<% tp.file.title %>"
WHERE status = "done"
SORT completed DESC
LIMIT 10
```

## Скорость за 4 недели

```dataview
TABLE length(rows) as "Завершено"
FROM "tasks/<% tp.file.title %>"
WHERE status = "done" AND completed >= date(today) - dur(28d)
GROUP BY dateformat(completed, "yyyy-'W'WW") as Week
SORT Week DESC
```
