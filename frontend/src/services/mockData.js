export const sampleDocument = {
  id: "doc-1",
  title: "Introduction to Software Engineering",
  file_type: "pdf",
  page_count: 4,
  sections: [
    {
      id: 1,
      title: "What is software engineering?",
      level: 1,
      location: 1,
      blocks: [
        {
          id: 1,
          kind: "paragraph",
          text: "Software engineering builds useful software through an organized process.",
          location: 1,
        },
        {
          id: 7,
          kind: "paragraph",
          text: "سافٹ ویئر انجینئرنگ منظم طریقے سے سافٹ ویئر بناتی ہے۔",
          location: 1,
        },
      ],
      children: [
        {
          id: 2,
          title: "Quality matters",
          level: 2,
          location: 2,
          blocks: [
            {
              id: 2,
              kind: "paragraph",
              text: "Good software is reliable, usable, and easy to maintain.",
              location: 2,
            },
          ],
          children: [],
        },
      ],
    },
    {
      id: 3,
      title: "The development process",
      level: 1,
      location: 3,
      blocks: [
        {
          id: 3,
          kind: "list_item",
          text: "Plan the problem and its users.",
          location: 3,
        },
        {
          id: 4,
          kind: "list_item",
          text: "Design, build, and test a solution.",
          location: 3,
        },
        {
          id: 5,
          kind: "slide_text",
          text: "Teams improve software through feedback.",
          location: 3,
        },
      ],
      children: [],
    },
    {
      id: 6,
      title: "Accessibility",
      level: 1,
      location: 4,
      blocks: [
        {
          id: 6,
          kind: "notice",
          text: "Image on page 4, no description available.",
          location: 4,
        },
      ],
      children: [],
    },
  ],
};
