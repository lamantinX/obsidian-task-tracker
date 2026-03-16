# Web Panel

Browser UI for the markdown-first task tracker vault.

## Run locally

1. Copy `.env.example` to `.env.local`
2. Set `TASK_TRACKER_VAULT_PATH` to the shared vault path if it is not the parent directory
3. Install dependencies: `npm install`
4. Start the app: `npm run dev`
5. Open `http://localhost:3000/login`

Default development credentials:

- `demo@example.com`
- `demo123`

## Notes

- Markdown files remain the source of truth
- The app reads and writes `projects/*.md` and `tasks/<project>/*.md`
- Authentication is cookie-based in `v1`
- Knowledge remains read-first and linked from the project workspace
