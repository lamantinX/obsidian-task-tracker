---
type: weekly
week: <% tp.date.now("YYYY-[W]WW") %>
---

# Неделя <% tp.date.now("[W]WW, YYYY") %>

## Завершённые задачи за неделю

```dataview
TABLE project as "Проект", completed as "Завершено", actual as "Факт"
FROM "tasks"
WHERE status = "done" AND completed >= date(today) - dur(6d)
SORT completed ASC
```

## Скорость по проектам

```dataview
TABLE length(rows) as "Завершено"
FROM "tasks"
WHERE status = "done" AND completed >= date(today) - dur(6d)
GROUP BY project
```

## Создано за неделю

```dataview
TABLE project as "Проект", status as "Статус", priority as "Приоритет"
FROM "tasks"
WHERE created >= date(today) - dur(6d)
SORT project ASC
```

## Очередь DeerFlow

```dataview
TABLE project as "Проект", deerflow_mode as "Режим", handoff_status as "Этап"
FROM "tasks"
WHERE executor = "deerflow" AND status != "done" AND status != "cancelled"
SORT created DESC
```

## Блокеры

```dataview
TABLE project as "Проект", blocked_by as "Блокеры", due as "Срок"
FROM "tasks"
WHERE status = "blocked"
SORT due ASC
```

## Ретроспектива

### Что сработало



### Что требует улучшения



### Ключевые решения



## План на следующую неделю

### Приоритеты

1.
2.
3.

### Carry-over

```dataview
TABLE project as "Проект", priority as "Приоритет", due as "Срок"
FROM "tasks"
WHERE status = "in-progress"
SORT priority ASC
```

---

[[<% tp.date.now("YYYY-[W]WW", -7) %>|Прошлая неделя]] | [[<% tp.date.now("YYYY-[W]WW", 7) %>|Следующая неделя]]
