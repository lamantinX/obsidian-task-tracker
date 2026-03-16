const tinaConfig = {
  branch: process.env.GIT_BRANCH ?? "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? "",
  token: process.env.TINA_TOKEN ?? "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "projects",
        label: "Projects",
        path: "../projects",
        format: "md",
        fields: [
          { name: "project", label: "Project slug", type: "string", required: true },
          { name: "full_name", label: "Full name", type: "string" },
          { name: "status", label: "Status", type: "string" },
          { name: "color", label: "Color", type: "string" },
          { name: "id_prefix", label: "ID prefix", type: "string", required: true },
          { name: "knowledge_board", label: "Knowledge board", type: "string" },
          { name: "next_id", label: "Next ID", type: "number" }
        ]
      },
      {
        name: "tasks",
        label: "Tasks",
        path: "../tasks",
        format: "md",
        ui: {
          router: ({ document }: { document: { _sys: { filename: string } } }) =>
            `/tasks?taskId=${document._sys.filename}`
        },
        fields: [
          { name: "id", label: "ID", type: "string", required: true },
          { name: "title", label: "Title", type: "string", required: true },
          {
            name: "status",
            label: "Status",
            type: "string",
            options: ["todo", "in-progress", "done", "blocked", "cancelled"],
            required: true
          },
          {
            name: "priority",
            label: "Priority",
            type: "string",
            options: ["high", "medium", "low"],
            required: true
          },
          { name: "project", label: "Project", type: "string", required: true },
          { name: "owner", label: "Owner", type: "string" },
          { name: "due", label: "Due", type: "datetime" },
          { name: "effort", label: "Effort", type: "string" },
          { name: "related_notes", label: "Related notes", type: "string", list: true },
          { name: "body", label: "Body", type: "rich-text", isBody: true }
        ]
      }
    ]
  }
};

export default tinaConfig;
