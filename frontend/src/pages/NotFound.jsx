import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import usePageTitle from "../hooks/usePageTitle";

function NotFound() {
  usePageTitle("Page not found");
  return (
    <EmptyState
      headingLevel={1}
      title="This page is not here"
      description="The address may be wrong, or the page may have moved."
      action={<Link className="btn" to="/">Home</Link>}
      secondaryAction={<><Link className="btn-ghost" to="/upload">Upload</Link><Link className="btn-ghost" to="/help">Help</Link></>}
    />
  );
}

export default NotFound;
