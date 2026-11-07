# API contract

The API accepts PDF and PPTX files up to 20 MB.

## Endpoints

- `POST /documents`: Send the file in a multipart form field named `file`. Returns the document JSON.
- `GET /documents/{id}`: Returns the document JSON for the document id.

Errors return JSON in this shape:

```json
{ "detail": "message" }
```

Status codes are `400` for an unsupported or empty file, `404` for a document id that does not exist, `413` for a file over the limit, and `500` for a processing failure.

## Document shape

```json
{
  "id": "doc-1",
  "title": "Introduction to Software Engineering",
  "file_type": "pdf",
  "page_count": 12,
  "sections": [
    {
      "id": 1,
      "title": "Chapter 1",
      "level": 1,
      "location": 1,
      "blocks": [
        { "id": 1, "kind": "paragraph", "text": "Some text.", "location": 1 }
      ],
      "children": []
    }
  ]
}
```

Section children use the same section shape. Block kinds are `paragraph`, `list_item`, `slide_text`, and `notice`.
