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
      description: "Just the number, e.g. 12 or 12.5",
      validation: (r) => r.required().positive(),
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

export const schemaTypes = [menuCategory, menuItem];
