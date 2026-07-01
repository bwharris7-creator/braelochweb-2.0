"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schema";

/**
 * Embedded Sanity Studio config (served at /studio — PLAN.md §2).
 * The desk is scoped to exactly what the taproom manager needs: the menu.
 * Site-wide content types added later (story, gallery) get their own
 * sections here, gated by role if needed.
 */
export default defineConfig({
  name: "braeloch",
  title: "Braeloch Brewing",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Food Menu")
              .child(
                S.list()
                  .title("Food Menu")
                  .items([
                    S.documentTypeListItem("menuItem").title("Menu Items"),
                    S.documentTypeListItem("menuCategory").title("Categories"),
                  ])
              ),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
