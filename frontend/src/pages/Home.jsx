import { Link } from "react-router-dom";

function Home() {
  return (
    <section>
      <h1>Home</h1>
      <p>Welcome to Hamnawa, your accessible study reader.</p>
      <p>Upload a PDF or PowerPoint file to read its content in a clear format.</p>
      <Link className="button-link" to="/upload">
        Upload a document
      </Link>
    </section>
  );
}

export default Home;
