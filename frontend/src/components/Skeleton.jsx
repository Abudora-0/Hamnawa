function Skeleton() {
  return (
    <div className="reader-skeleton" aria-hidden="true">
      <div className="skeleton-title" />
      <div className="skeleton-player" />
      <div className="skeleton-line skeleton-line-wide" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line-short" />
      <div className="skeleton-line skeleton-line-wide" />
    </div>
  );
}

export default Skeleton;
