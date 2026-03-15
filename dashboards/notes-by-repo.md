# Заметки по репозиториям

```dataview
TABLE WITHOUT ID
  repo as "Репозиторий",
  length(rows) as "Заметок",
  length(filter(rows, (r) => r.note_type = "permanent")) as "Permanent",
  length(filter(rows, (r) => r.note_type = "literature")) as "Literature",
  length(filter(rows, (r) => r.note_type = "structure")) as "Structure"
FROM "knowledge"
WHERE id AND repo
GROUP BY repo
SORT repo ASC
```
