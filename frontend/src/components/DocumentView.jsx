import { isUrdu } from "../utils/readingQueue";

function Section({ section, currentTargetId }) {
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
            <li
              className={currentTargetId === `block-${item.id}` ? "current" : ""}
              id={`block-${item.id}`}
              lang={isUrdu(item.text) ? "ur" : undefined}
              dir={isUrdu(item.text) ? "rtl" : undefined}
              key={item.id}
            >
              {item.text}
            </li>
          ))}
        </ul>,
      );
    } else if (block.kind === "notice") {
      const urdu = isUrdu(block.text);
      content.push(
        <div
          className={`notice${currentTargetId === `block-${block.id}` ? " current" : ""}`}
          id={`block-${block.id}`}
          role="note"
          key={block.id}
          lang={urdu ? "ur" : undefined}
          dir={urdu ? "rtl" : undefined}
        >
          <p>
            <strong>Notice:</strong> {block.text}
          </p>
        </div>,
      );
    } else {
      const urdu = isUrdu(block.text);
      content.push(
        <p
          className={currentTargetId === `block-${block.id}` ? "current" : ""}
          id={`block-${block.id}`}
          lang={urdu ? "ur" : undefined}
          dir={urdu ? "rtl" : undefined}
          key={block.id}
        >
          {block.text}
        </p>,
      );
    }
  }

  const headingUrdu = isUrdu(section.title);
  return (
    <section>
      <Heading
        className={currentTargetId === `section-${section.id}` ? "current" : ""}
        id={`section-${section.id}`}
        lang={headingUrdu ? "ur" : undefined}
        dir={headingUrdu ? "rtl" : undefined}
      >
        {section.title}
      </Heading>
      {content}
      {section.children.map((child) => (
        <Section
          section={child}
          currentTargetId={currentTargetId}
          key={child.id}
        />
      ))}
    </section>
  );
}

function DocumentView({ document, currentTargetId }) {
  return (
    <div>
      {document.sections.map((section) => (
        <Section
          section={section}
          currentTargetId={currentTargetId}
          key={section.id}
        />
      ))}
    </div>
  );
}

export default DocumentView;
