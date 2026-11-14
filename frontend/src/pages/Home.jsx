import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecent } from "../utils/documentMemory";

function Home() {
  const [recentDocuments, setRecentDocuments] = useState([]);

  useEffect(() => {
    setRecentDocuments(getRecent());
  }, []);

  return (
    <section>
      <h1>Home</h1>
      <p>Welcome to Hamnawa, your accessible study reader.</p>
      <p>Upload a PDF or PowerPoint file to read its content in a clear format.</p>
      <Link className="button-link" to="/upload">
        Upload a document
      </Link>
      <p>Documents stay on the server for 24 hours.</p>
      {recentDocuments.length ? (
        <>
          <h2>Recent documents</h2>
          <ul>
            {recentDocuments.map((document) => (
              <li key={document.id}>
                <Link to={`/reader/${document.id}`}>{document.title}</Link>{" "}
                ({document.file_type})
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

export default Home;
