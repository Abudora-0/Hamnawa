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

  function addItem(
    text,
    targetId,
    sectionId,
    sectionTitle,
    sectionLevel,
    location,
    searchText,
    isHeading = false,
  ) {
    items.push({
      id: `reading-item-${itemNumber}`,
      text,
      targetId,
      sectionId,
      sectionTitle,
      sectionLevel,
      location,
      searchText,
      isHeading,
    });
    itemNumber += 1;
  }

  function addSection(section) {
    const sectionId = section.id;
    const headingText = cuesEnabled
      ? `Heading level ${section.level}. ${section.title}`
      : section.title;
    addItem(
      headingText,
      `section-${sectionId}`,
      sectionId,
      section.title,
      section.level,
      section.location,
      section.title,
      true,
    );

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
            section.title,
            section.level,
            listItems[0].location,
            "",
          );
        }
        listItems.forEach((listItem) => {
          addItem(
            listItem.text,
            `block-${listItem.id}`,
            sectionId,
            section.title,
            section.level,
            listItem.location,
            listItem.text,
          );
        });
        index -= 1;
      } else if (block.kind === "notice") {
        addItem(
          `Notice. ${block.text}`,
          `block-${block.id}`,
          sectionId,
          section.title,
          section.level,
          block.location,
          block.text,
        );
      } else {
        splitSentences(block.text).forEach((sentence) => {
          addItem(
            sentence,
            `block-${block.id}`,
            sectionId,
            section.title,
            section.level,
            block.location,
            sentence,
          );
        });
      }
    }

    section.children.forEach(addSection);
  }

  document.sections.forEach(addSection);
  return items;
}
