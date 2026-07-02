import { defineField, defineType } from "sanity";

/**
 * Menu content model (PLAN.md §2 CMS requirement).
 * Kept deliberately small: the taproom manager edits categories and items —
 * name, description, price, dietary tags, availability — nothing else.
 */

export const menuCategory = defineType({
  name: "menuCategory",
  title: "Menu Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Category Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "note",
      title: "Category Note",
      type: "string",
      description:
        "Optional line under the category heading, e.g. 'served on a brioche bun with kettle chips'.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first on the menu page.",
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: "Display Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});

export const menuItem = defineType({
  name: "menuItem",
  title: "Menu Item",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Item Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "menuCategory" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "One or two lines — ingredients, style, what makes it good.",
    }),
    defineField({
      name: "price",
      title: "Price ($)",
      type: "number",
      description: "Just the number, e.g. 12 or 12.5. Leave blank to show the item without a price.",
      validation: (r) => r.positive(),
    }),
    defineField({
      name: "dietaryTags",
      title: "Dietary Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Vegetarian", value: "V" },
          { title: "Vegan", value: "VG" },
          { title: "Gluten-Free", value: "GF" },
          { title: "Spicy", value: "S" },
        ],
        layout: "grid",
      },
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "available",
      title: "Available",
      type: "boolean",
      description: "Turn off to hide an item (86'd) without deleting it.",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first within the category.",
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "category.title", available: "available", media: "photo" },
    prepare({ title, subtitle, available, media }) {
      return {
        title: available === false ? `${title} (hidden)` : title,
        subtitle,
        media,
      };
    },
  },
  orderings: [
    { title: "Display Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});

/**
 * Private-event inquiries submitted from the website form (PLAN.md Phase 3).
 * Created via the /api/inquiry route; read-only paper trail for staff.
 */
export const eventInquiry = defineType({
  name: "eventInquiry",
  title: "Private Event Inquiry",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Phone", type: "string", readOnly: true }),
    defineField({ name: "eventDate", title: "Requested Date", type: "string", readOnly: true }),
    defineField({ name: "headcount", title: "Headcount", type: "string", readOnly: true }),
    defineField({ name: "eventType", title: "Event Type", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", readOnly: true }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime", readOnly: true }),
    defineField({
      name: "handled",
      title: "Handled",
      type: "boolean",
      description: "Check off once someone has replied.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "eventType", handled: "handled" },
    prepare({ title, subtitle, handled }) {
      return { title: `${handled ? "✓ " : "● "}${title ?? "Inquiry"}`, subtitle };
    },
  },
});

export const schemaTypes = [menuCategory, menuItem, eventInquiry];
