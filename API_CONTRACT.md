# Hamnawa API contract (version 2)

The React frontend talks to a FastAPI backend over HTTP and JSON. There are no user accounts. A document belongs to whoever knows its id, which is a random UUID. Uploaded files are processed once and deleted after a retention period.

## Conventions

- Default base URL is `http://localhost:8000`. The frontend reads it from `VITE_API_URL`.
- All text is UTF-8. Urdu text must be stored and returned exactly as extracted.
- Every error returns JSON in this shape, and `detail` is always a plain string a user can read:

```json
{ "detail": "message" }
```

- Override the FastAPI default 422 handler so it also returns a string, for example `"The request was not valid."`.
- CORS: allow the origins listed in `ALLOWED_ORIGINS` (comma separated, default `http://localhost:5173`), methods `GET`, `POST`, `DELETE`, and the `Content-Type` header.

## Endpoints

### GET /health

Returns `200` with `{ "status": "ok" }`.

### POST /documents

Request: `multipart/form-data`

| Field | Required | Notes |
| --- | --- | --- |
| `file` | yes | PDF or PPTX |
| `language` | no | `auto` (default), `en`, or `ur`. A hint for OCR on scanned files |

Success: `201` with the document JSON below. Processing is synchronous in version 2. The target is under 20 seconds for a 100 page file.

Errors:

| Status | When | Example `detail` |
| --- | --- | --- |
| 400 | Not a PDF or PPTX (check the file content, not only the extension) | `Please choose a PDF or PPTX file.` |
| 400 | Empty file | `This file is empty.` |
| 400 | Password protected or unreadable | `This PDF is password protected.` or `We could not read this file.` |
| 400 | More than 200 pages or slides | `This document has too many pages. The limit is 200.` |
| 413 | Larger than 20 MB | `The file must be 20 MB or smaller.` |
| 500 | Processing failed | `Processing failed. Please try again.` |

### GET /documents/{id}

Returns `200` with the document JSON.

Unknown or expired id: `404` with `{ "detail": "This document is no longer available. Please upload it again." }`

### DELETE /documents/{id}

Deletes the database rows and the stored file. Returns `204` with no body. An unknown id also returns `204`, so the call is safe to repeat.

### POST /speech/synthesize

Cloud voice for the reader. The Azure key stays on the server.

Request JSON:

```json
{ "text": "Some sentence.", "lang": "en-US", "voice": null }
```

- `lang` is `en-US` or `ur-PK`.
- `voice` is optional. Suggested defaults: `en-US-JennyNeural` and `ur-PK-UzmaNeural`.
- `text` is at most 500 characters, otherwise `400`.

Success: `200` with `audio/mpeg`.

If Azure is not configured or the call fails: `503` with `{ "detail": "Cloud voice is not available." }`. The frontend then falls back to the device voice, so this is never fatal.

Tip: cache the audio on disk by a hash of text, lang, and voice to save the free quota.

## Document shape

```json
{
  "id": "3f1c8a3e-6a0e-4a43-9b8e-0e8a4f5d2c11",
  "title": "Introduction to Software Engineering",
  "file_type": "pdf",
  "page_count": 12,
  "status": "ready",
  "created_at": "2026-11-14T12:00:00Z",
  "expires_at": "2026-11-15T12:00:00Z",
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

Field notes:

- `id` is always a string (UUID).
- `title` comes from the file metadata if present, otherwise the file name without its extension.
- `file_type` is `pdf` or `pptx`. `page_count` counts pages or slides.
- `created_at` and `expires_at` are ISO 8601 strings in UTC.
- Section `id` and block `id` are integers and must be unique inside the document.
- `level` is 1 to 6. `location` is the page or slide number where the section or block starts.
- `kind` is one of `paragraph`, `list_item`, `slide_text`, or `notice`.

Structure rules the frontend relies on:

1. Sections and blocks are in reading order. A section's own blocks come first, then its `children`.
2. Every section always has both `blocks` and `children` arrays, even when empty.
3. Block `text` is never empty or only spaces. Clean it first: fix hyphenation, remove repeated headers and footers, and keep multi-column text in reading order.
4. PPTX: each slide becomes a level 1 section titled with the slide title, or `Slide N` if it has none. Body text uses `slide_text`.
5. PDF with no detectable headings: one level 1 section titled with the document title.
6. Images, tables, and charts that cannot be read become a `notice` block, for example `Image on page 4, no description available.` or `Table on page 7 was skipped.`

## Limits

- PDF and PPTX only.
- At most 20 MB. Reject early when `Content-Length` is larger.
- At most 200 pages or slides.

## Retention and privacy

- Delete documents and stored files after `RETENTION_HOURS` (default 24). Run cleanup at startup and every hour.
- Never write document text to logs.
- No accounts and no analytics.

## Security

- Check file signatures: `%PDF-` for PDF, and a zip containing `ppt/` for PPTX.
- Store files under a random name outside any public folder. Never use the client file name in a path.
- Enforce the size limit while streaming the upload.
- Parse inside try and except with a time limit. A malformed file must produce a clear `400` or `500`, never crash the server.

## Configuration (environment variables)

| Name | Default | Notes |
| --- | --- | --- |
| `DATABASE_URL` | none | For example `mysql+pymysql://hamnawa:hamnawa_pass@localhost:3306/hamnawa` |
| `UPLOAD_DIR` | `./storage` | Where uploaded files are kept |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma separated |
| `RETENTION_HOURS` | `24` | |
| `MAX_UPLOAD_MB` | `20` | |
| `AZURE_SPEECH_KEY` | empty | Optional. Empty means `/speech/synthesize` returns 503 |
| `AZURE_SPEECH_REGION` | empty | Optional |

## Database

See `database/schema.sql`. The tables are `documents`, `sections` (with `parent_id` for the tree), and `content_blocks`.

## Working without the backend

The frontend has a mock mode that returns a sample document. It is on by default. Set `VITE_USE_MOCK=false` in `frontend/.env` to call this API instead.
