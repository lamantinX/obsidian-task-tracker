# Входящие знания

```dataview
TABLE note_type as "Тип", project as "Проект", repo as "Репозиторий", created as "Создано"
FROM "knowledge/inbox"
WHERE file.name != "README"
SORT created DESC
```
