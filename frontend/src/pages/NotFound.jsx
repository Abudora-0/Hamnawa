import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="panel">
      <h1>This page is not here.</h1>
      <svg aria-hidden="true" width="180" height="32" viewBox="0 0 180 32">
        <path d="M2 16h52c10 0 10-8 20-8s10 16 20 16 10-16 20-16 10 8 20 8h44" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>
      <p>The address may be wrong, or the page may have moved.</p>
      <p>
        <Link className="btn" to="/">Home</Link>{" "}
        <Link className="btn-ghost" to="/upload">Upload</Link>
      </p>
    </section>
  );
}

export default NotFound;
