#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/common.sh"

NOTE_ID="${1:-}"
[[ -n "$NOTE_ID" ]] || die "использование: ./automation/link-zettel-board.sh <note-id>"

FILE="$(find_note_by_id "$NOTE_ID")"
[[ -n "$FILE" ]] || die "не найден файл для ID $NOTE_ID"

print_summary "$FILE"

PROJECT="$(frontmatter_value "$FILE" project)"
REPO="$(frontmatter_value "$FILE" repo)"

echo "Рекомендуемые доски для привязки:"
if [[ -n "$PROJECT" ]]; then
  echo "- project board: knowledge/projects/$PROJECT/index.md"
fi
if [[ -n "$REPO" ]]; then
  REPO_SLUG="$(basename "$REPO" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9._-')"
  echo "- repo board: knowledge/repos/$REPO_SLUG/index.md"
fi
