function PageHeader({ eyebrow, title, description }) {
  return (
    <header className="page-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <span className="thread thread-under" aria-hidden="true" />
    </header>
  );
}

export default PageHeader;
