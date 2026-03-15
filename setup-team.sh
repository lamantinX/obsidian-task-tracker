#!/usr/bin/env bash
set -euo pipefail

VAULT_PATH="$(cd "$(dirname "$0")" && pwd)"
TODAY="$(date +%Y-%m-%d)"

mkdir -p \
  "$VAULT_PATH/docs" \
  "$VAULT_PATH/ideas" \
  "$VAULT_PATH/research" \
  "$VAULT_PATH/dispatch" \
  "$VAULT_PATH/automation" \
  "$VAULT_PATH/knowledge/inbox" \
  "$VAULT_PATH/knowledge/notes" \
  "$VAULT_PATH/knowledge/structures" \
  "$VAULT_PATH/knowledge/projects" \
  "$VAULT_PATH/knowledge/repos" \
  "$VAULT_PATH/dashboards" \
  "$VAULT_PATH/archive" \
  "$VAULT_PATH/daily" \
  "$VAULT_PATH/weekly"

echo "============================================"
echo "  Team setup для Obsidian Task Tracker"
echo "============================================"
echo
echo "Vault path: $VAULT_PATH"
echo "Формат ID team mode: <PREFIX>-<YYYYMMDD>-<NN>"
echo "Поле next_id будет сохранено только для legacy-совместимости."
echo

projects=()
while true; do
  read -rp "Project slug (пусто для завершения): " name
  [[ -z "$name" ]] && break

  read -rp "  Display name [$name]: " full_name
  full_name="${full_name:-$name}"

  suggested_prefix="$(echo "$name" | tr '[:lower:]' '[:upper:]' | tr -cd 'A-Z0-9' | cut -c1-4)"
  suggested_prefix="${suggested_prefix:-PRJ}"
  read -rp "  ID prefix [$suggested_prefix]: " prefix
  prefix="$(echo "${prefix:-$suggested_prefix}" | tr '[:lower:]' '[:upper:]')"

  read -rp "  Repo path (absolute, можно пусто): " repo
  repo_slug=""
  if [[ -n "$repo" ]]; then
    repo_slug="$(basename "$repo" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9._-')"
  fi

  projects+=("$name|$full_name|$prefix|$repo|$repo_slug")
  echo
done

for entry in "${projects[@]}"; do
  IFS='|' read -r name full_name prefix repo repo_slug <<< "$entry"

  mkdir -p "$VAULT_PATH/tasks/$name" "$VAULT_PATH/archive/$name" "$VAULT_PATH/knowledge/projects/$name"

  cat > "$VAULT_PATH/projects/$name.md" <<EOF
---
project: $name
full_name: $full_name
repo: $repo
remote:
status: active
started: $TODAY
color:
id_prefix: $prefix
knowledge_board: knowledge/projects/$name/index
next_id: 1
---

# $full_name

> Этот файл — источник истины для project-to-repo mapping.
> \`next_id\` сохранён только для legacy-совместимости. Для новых team-mode сущностей используйте формат \`<PREFIX>-<YYYYMMDD>-<NN>\`.

## Repo

\`$repo\`

## Доска знаний

- [[knowledge/projects/$name/index|Доска знаний проекта]]

## Активные задачи

\`\`\`dataview
TABLE status, priority, owner, executor, handoff_status
FROM "tasks/$name"
WHERE status != "done" AND status != "cancelled"
SORT choice(priority, "high", 1, "medium", 2, "low", 3) ASC, created DESC
\`\`\`
EOF

  cat > "$VAULT_PATH/knowledge/projects/$name/index.md" <<EOF
---
type: knowledge-board
project: $name
repo: $repo
note_type: structure
created: $TODAY
related_notes: []
---

# Доска знаний проекта $full_name

## Ключевые knowledge notes

\`\`\`dataview
TABLE note_type as "Тип", created as "Создано"
FROM "knowledge"
WHERE project = "$name" AND file.path != this.file.path
SORT created DESC
\`\`\`

## Идеи

\`\`\`dataview
TABLE priority as "Приоритет", handoff_status as "Этап", created as "Создано"
FROM "ideas"
WHERE project = "$name"
SORT created DESC
\`\`\`

## Research

\`\`\`dataview
TABLE owner as "Владелец", deerflow_mode as "Режим", created as "Создано"
FROM "research"
WHERE project = "$name"
SORT created DESC
\`\`\`

## Активные задачи

\`\`\`dataview
TABLE owner as "Владелец", executor as "Исполнитель", status as "Статус", handoff_status as "Этап"
FROM "tasks"
WHERE project = "$name" AND status != "done" AND status != "cancelled"
SORT created DESC
\`\`\`
EOF

  if [[ -n "$repo_slug" ]]; then
    mkdir -p "$VAULT_PATH/knowledge/repos/$repo_slug"
    cat > "$VAULT_PATH/knowledge/repos/$repo_slug/index.md" <<EOF
---
type: knowledge-board
project: $name
repo: $repo
note_type: structure
created: $TODAY
related_notes: []
---

# Доска знаний репозитория $repo_slug

## Заметки

\`\`\`dataview
TABLE note_type as "Тип", project as "Проект", created as "Создано"
FROM "knowledge"
WHERE repo = "$repo" AND file.path != this.file.path
SORT created DESC
\`\`\`

## Активные задачи

\`\`\`dataview
TABLE owner as "Владелец", executor as "Исполнитель", status as "Статус"
FROM "tasks"
WHERE repo = "$repo" AND status != "done" AND status != "cancelled"
SORT created DESC
\`\`\`
EOF
  fi

  echo "Создан проект: $name ($prefix)"
done

echo
echo "Team setup завершён."
echo "Откройте dashboard.md и knowledge/knowledge-hub.md в Obsidian."
