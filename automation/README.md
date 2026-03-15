# Automation scaffolding

Здесь лежат shell-скрипты для подготовки handoff и knowledge workflow.

Ограничения:
- скрипты не должны самостоятельно принимать продуктовые решения;
- скрипты не должны запускать execution без явного dispatch;
- скрипты валидируют frontmatter, печатают summary и готовят structured prompt.

Ожидаемое окружение:
- `bash`
- `find`, `sed`, `awk`, `grep`
- vault доступен как обычная файловая система на сервере
