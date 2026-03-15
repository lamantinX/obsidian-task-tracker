#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

NOTE_TYPE="${1:-}"
TITLE="${2:-}"
PROJECT="${3:-}"
REPO="${4:-}"

[[ -n "$NOTE_TYPE" && -n "$TITLE" ]] || die "использование: ./automation/capture-zettel.sh <permanent|literature|structure|meeting> <title> [project] [repo]"

STAMP="$(date +%Y%m%d-%H%M)"
SLUG="$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9а-яё._-]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')"
TARGET_DIR="$VAULT_ROOT/knowledge/notes"

if [[ "$NOTE_TYPE" == "structure" ]]; then
  TARGET_DIR="$VAULT_ROOT/knowledge/structures"
elif [[ "$NOTE_TYPE" == "meeting" ]]; then
  TARGET_DIR="$VAULT_ROOT/knowledge/inbox"
fi

echo "Подготовка knowledge note"
echo "Тип: $NOTE_TYPE"
echo "Заголовок: $TITLE"
echo "Проект: $PROJECT"
echo "Репозиторий: $REPO"
echo "Рекомендуемый файл: $TARGET_DIR/${STAMP}-${SLUG}.md"
