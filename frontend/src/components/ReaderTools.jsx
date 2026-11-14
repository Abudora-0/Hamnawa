function OutlineSection({ section, currentSectionId, onSelect }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(section.id)}
        aria-current={section.id === currentSectionId ? "true" : undefined}
        className={`outline-level-${section.level}`}
      >
        {section.title}
      </button>
      {section.children.length ? (
        <ul>
          {section.children.map((child) => (
            <OutlineSection
              key={child.id}
              section={child}
              currentSectionId={currentSectionId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function ReaderTools({
  document,
  currentSectionId,
  onSelectSection,
  goToPage,
  search,
  nextMatch,
  previousMatch,
  matchCount,
  currentMatch,
  bookmarks,
  onAddBookmark,
  onGoToBookmark,
  onRemoveBookmark,
}) {
  const locationLabel = document.file_type === "pptx" ? "slide" : "page";

  function handlePageSubmit(event) {
    event.preventDefault();
    goToPage(event.currentTarget.elements.page.value);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    search(event.currentTarget.elements.search.value);
  }

  return (
    <div className="reader-tools">
      <details open>
        <summary>Outline</summary>
        <nav aria-label="Document outline">
          <ul className="document-outline">
            {document.sections.map((section) => (
              <OutlineSection
                key={section.id}
                section={section}
                currentSectionId={currentSectionId}
                onSelect={onSelectSection}
              />
            ))}
          </ul>
        </nav>
      </details>
      <details open>
        <summary>Find and go to</summary>
        <form onSubmit={handlePageSubmit}>
          <label htmlFor="page-input">Go to {locationLabel}</label>
          <input id="page-input" name="page" type="number" min="1" />
          <button type="submit">Go</button>
        </form>
        <form onSubmit={handleSearchSubmit}>
          <label htmlFor="search-input">Search</label>
          <input id="search-input" name="search" type="search" />
          <button type="submit">Find</button>
          <button type="button" onClick={previousMatch}>
            Previous match
          </button>
          <button type="button" onClick={nextMatch}>
            Next match
          </button>
          <p>{matchCount ? `Match ${currentMatch} of ${matchCount}` : ""}</p>
        </form>
      </details>
      <details open>
        <summary>Bookmarks</summary>
        <button type="button" onClick={onAddBookmark}>
          Add bookmark
        </button>
        {bookmarks.length ? (
          <ul>
            {bookmarks.map((bookmark) => (
              <li key={bookmark.id}>
                <button
                  type="button"
                  onClick={() => onGoToBookmark(bookmark)}
                >
                  Go to {bookmark.label}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveBookmark(bookmark.id)}
                  aria-label={`Remove ${bookmark.label}`}
                >
                  Remove {bookmark.label}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookmarks yet.</p>
        )}
      </details>
    </div>
  );
}

export default ReaderTools;
