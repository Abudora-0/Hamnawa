import { formatExpiry } from "../utils/expiry";

function ReaderTitleBar({ document, progress }) {
  const count = document.file_type === "pptx"
    ? `${document.page_count || document.sections.length} slides`
    : `${document.page_count || document.sections.length} pages`;

  return (
    <header className="reader-title-bar">
      <div>
        <p className="eyebrow">Reader / In focus</p>
        <h1>{document.title}</h1>
      </div>
      <div className="reader-title-meta">
        <span className="tag">{document.file_type}</span>
        <span>{count}</span>
        <span>{formatExpiry(document.expires_at)}</span>
      </div>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <span className="live-region">Reading progress: {progress}%</span>
    </header>
  );
}

export default ReaderTitleBar;
