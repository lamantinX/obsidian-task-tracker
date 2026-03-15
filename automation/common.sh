#!/usr/bin/env bash
set -euo pipefail

VAULT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

die() {
  echo "Ошибка: $*" >&2
  exit 1
}

find_note_by_id() {
  local item_id="$1"
  find "$VAULT_ROOT/tasks" "$VAULT_ROOT/ideas" "$VAULT_ROOT/research" "$VAULT_ROOT/dispatch" "$VAULT_ROOT/knowledge" \
    -type f -name "*.md" -print 2>/dev/null | while IFS= read -r file; do
      if grep -Eq "^id:[[:space:]]*$item_id([[:space:]]*)$" "$file"; then
        echo "$file"
        return 0
      fi
    done
}

frontmatter_value() {
  local file="$1"
  local key="$2"
  awk -F': *' -v target="$key" '
    BEGIN { in_fm=0 }
    /^---$/ { if (in_fm==0) { in_fm=1; next } else { exit } }
    in_fm==1 && $1==target {
      sub(/^[^:]*:[ ]*/, "", $0)
      print $0
      exit
    }
  ' "$file"
}

require_value() {
  local value="$1"
  local label="$2"
  [[ -n "${value// }" ]] || die "в поле '$label' нет значения"
}

print_summary() {
  local file="$1"
  echo "Файл: $file"
  echo "ID: $(frontmatter_value "$file" id)"
  echo "Заголовок: $(frontmatter_value "$file" title)"
  echo "Проект: $(frontmatter_value "$file" project)"
  echo "Исполнитель: $(frontmatter_value "$file" executor)"
  echo "Статус: $(frontmatter_value "$file" status)"
  echo "Handoff: $(frontmatter_value "$file" handoff_status)"
  echo "Repo: $(frontmatter_value "$file" repo)"
}

print_prompt_header() {
  local mode="$1"
  echo
  echo "============================================"
  echo "Подготовленный prompt: $mode"
  echo "============================================"
}
