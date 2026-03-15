# Заметки по проектам

```dataview
TABLE WITHOUT ID
  project as "Проект",
  length(rows) as "Заметок",
  length(filter(rows, (r) => r.note_type = "permanent")) as "Permanent",
  length(filter(rows, (r) => r.note_type = "literature")) as "Literature",
  length(filter(rows, (r) => r.note_type = "structure")) as "Structure"
FROM "knowledge"
WHERE id AND project
GROUP BY project
SORT project ASC
```
