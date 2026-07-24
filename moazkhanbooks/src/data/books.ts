export interface Book {
  title: string;
  description: string;
  genre: string;
  coverColor: string;
}

export const books: Book[] = [
  {
    title: "The Godman",
    genre: "Literary crime thriller",
    description:
      "A literary crime thriller that explores a morally complex world and refuses an easy ending.",
    coverColor: "#5c1a24",
  },
  {
    title: "The Closing Number",
    genre: "Mystery · Hong Kong",
    description: "A mystery set in Hong Kong, following a case that closes in on more than one suspect.",
    coverColor: "#1f3b3a",
  },
  {
    title: "A Memory of Smell",
    genre: "Thriller · Prague",
    description: "A Prague-set thriller where the past resurfaces through the senses.",
    coverColor: "#1c2b4a",
  },
  {
    title: "Mirrored Falls",
    genre: "Literary novel · English & Hindustani Hindi",
    description:
      "A literary novel published in both English and Hindustani Hindi editions.",
    coverColor: "#3a2b1c",
  },
  {
    title: "The Girl Who Saw in the Dark",
    genre: "Middle-grade novel",
    description:
      "A middle-grade novel about a girl with night blindness who builds a company from her greatest challenge.",
    coverColor: "#4a3b1f",
  },
  {
    title: "Rich Habits, Young Minds",
    genre: "Financial literacy · Family",
    description:
      "A financial literacy book following one family through five money lessons.",
    coverColor: "#2f4a2b",
  },
  {
    title: "The Question Kids",
    genre: "Children's nonfiction",
    description: "Introduces young readers to six real-world inventors.",
    coverColor: "#5a2f4a",
  },
];
