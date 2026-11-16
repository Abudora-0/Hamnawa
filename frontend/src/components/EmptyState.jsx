function EmptyState({ title, description, action, secondaryAction }) {
  return (
    <div className="empty-state panel">
      <svg aria-hidden="true" viewBox="0 0 120 90">
        <path d="M12 23c18-8 31-8 48 2v49c-17-10-30-10-48-2V23Zm96 0c-18-8-31-8-48 2v49c17-10 30-10 48-2V23Z" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M60 25v49M30 39h14m-14 12h14m32-12h14m-14 12h14" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M48 16c5-8 9 8 14 0s9-8 14 0" fill="none" stroke="var(--accent-2)" strokeWidth="4" />
      </svg>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="empty-actions">
        {action}
        {secondaryAction}
      </div>
    </div>
  );
}

export default EmptyState;
