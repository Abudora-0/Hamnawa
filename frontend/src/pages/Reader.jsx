import { Link } from "react-router-dom";
import { useDocument } from "../context/DocumentContext";

function Section({ section }) {
  const headingLevel = Math.min(section.level + 1, 6);
  const Heading = `h${headingLevel}`;
  const content = [];

  for (let index = 0; index < section.blocks.length; index += 1) {
    const block = section.blocks[index];
    if (block.kind === "list_item") {
      const items = [];
      while (
        index < section.blocks.length &&
        section.blocks[index].kind === "list_item"
      ) {
        items.push(section.blocks[index]);
        index += 1;
      }
      index -= 1;
      content.push(
        <ul key={`list-${items[0].id}`}>
          {items.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>,
      );
    } else if (block.kind === "notice") {
      content.push(
        <div className="notice" role="note" key={block.id}>
          <p>
            <strong>Notice:</strong> {block.text}
          </p>
        </div>,
      );
    } else {
      content.push(<p key={block.id}>{block.text}</p>);
    }
  }

  return (
    <section>
      <Heading>{section.title}</Heading>
      {content}
      {section.children.map((child) => (
        <Section section={child} key={child.id} />
      ))}
    </section>
  );
}

function Reader() {
  const { document: currentDocument } = useDocument();

  if (!currentDocument) {
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
      <h1>{currentDocument.title}</h1>
      {currentDocument.sections.map((section) => (
        <Section section={section} key={section.id} />
      ))}
    </section>
  );
}

export default Reader;
