Синхронизировать git-активность по проектным репозиториям.

## Логика
1. Прочитай `projects/*.md` и поле `repo`.
2. Для каждого репозитория:
   - `git fetch`
   - `git log --oneline`
   - `git status --short`
   - `git branch --show-current`
3. При выводе ориентируйся на русскоязычный summary.
4. Не меняй task status и handoff status автоматически.
