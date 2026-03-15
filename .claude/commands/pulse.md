Собрать краткий русскоязычный pulse по проектам.

## Логика
1. Прочитай `projects/*.md` и все задачи.
2. Покажи по каждому проекту:
   - активные задачи;
   - задачи DeerFlow;
   - задачи Codex;
   - blocked;
   - waiting review;
   - knowledge activity, если есть новые notes.
3. Для repo с `repo` собери `git log --oneline` по инструкции из `AGENTS.md`.
4. Не изменяй execution status автоматически; pulse — это обзор, а не dispatch.
