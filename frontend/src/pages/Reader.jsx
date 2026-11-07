import { Link } from "react-router-dom";
import { useDocument } from "../context/DocumentContext";

function Section({ section }) {
  const headingLevel = Math.min(section.level + 1, 6);
  const Heading = `h${headingLevel}`;
  const listItems = section.blocks.filter((block) => block.kind === "list_item");

  return (
    <section>
      <Heading>{section.title}</Heading>
      {section.blocks.map((block) => {
        if (block.kind === "list_item") {
          return null;
        }
        if (block.kind === "notice") {
          return (
            <div className="notice" role="note" key={block.id}>
              <p>
                <strong>Notice:</strong> {block.text}
              </p>
            </div>
          );
        }
        return <p key={block.id}>{block.text}</p>;
      })}
      {listItems.length > 0 && (
        <ul>
          {listItems.map((block) => (
            <li key={block.id}>{block.text}</li>
          ))}
        </ul>
      )}
      {section.children.map((child) => (
        <Section section={child} key={child.id} />
      ))}
    </section>
  );
}

function Reader() {
  const { document } = useDocument();

  if (!document) {
    return (
      <section>
        <h1>Reader</h1>
        <p>No document loaded yet.</p>
        <Link to="/upload">Upload a document</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>{document.title}</h1>
      {document.sections.map((section) => (
        <Section section={section} key={section.id} />
      ))}
    </section>
  );
}

export default Reader;
