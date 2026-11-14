export function isUrdu(text) {
  return /[\u0600-\u06FF]/.test(text);
}

export function splitSentences(text) {
  return text
    .trim()
    .split(/(?<=[.!?۔])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function buildQueue(document, cuesEnabled) {
  const items = [];
  let itemNumber = 0;

  function addItem(text, targetId, sectionId, isHeading = false) {
    items.push({
      id: `reading-item-${itemNumber}`,
      text,
      targetId,
      sectionId,
      isHeading,
    });
    itemNumber += 1;
  }

  function addSection(section) {
    const sectionId = section.id;
    const headingText = cuesEnabled
      ? `Heading level ${section.level}. ${section.title}`
      : section.title;
    addItem(headingText, `section-${sectionId}`, sectionId, true);

    for (let index = 0; index < section.blocks.length; index += 1) {
      const block = section.blocks[index];
      if (block.kind === "list_item") {
        const listItems = [];
        while (
          index < section.blocks.length &&
          section.blocks[index].kind === "list_item"
        ) {
          listItems.push(section.blocks[index]);
          index += 1;
        }
        if (cuesEnabled) {
          const itemLabel = listItems.length === 1 ? "item" : "items";
          addItem(
            `List of ${listItems.length} ${itemLabel}.`,
            `block-${listItems[0].id}`,
            sectionId,
          );
        }
        listItems.forEach((listItem) => {
          addItem(listItem.text, `block-${listItem.id}`, sectionId);
        });
        index -= 1;
      } else if (block.kind === "notice") {
        addItem(`Notice. ${block.text}`, `block-${block.id}`, sectionId);
      } else {
        splitSentences(block.text).forEach((sentence) => {
          addItem(sentence, `block-${block.id}`, sectionId);
        });
      }
    }

    section.children.forEach(addSection);
  }

  document.sections.forEach(addSection);
  return items;
}
