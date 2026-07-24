export interface Book {
  title: string;
  description: string;
  genre: string;
  coverColor: string;
  link?: string;
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
    link: "https://a.co/d/07JWTseX",
  },
  {
    title: "The Question Kids",
    genre: "Children's nonfiction",
    description: "Introduces young readers to six real-world inventors.",
    coverColor: "#5a2f4a",
  },
  {
    title: "The Trades AI Can't Touch",
    genre: "Nonfiction · Skilled trades",
    description:
      "Six industrial trades powering Canada and the United States, and the human judgment behind them that can't be automated.",
    coverColor: "#6b1f28",
  },
  {
    title: "AI Edge",
    genre: "Nonfiction · Trading & AI",
    description:
      "A day trader's playbook for using AI to find opportunities, execute with precision, and manage risk like a pro.",
    coverColor: "#1f4a3a",
  },
  {
    title: "From the Plant Floor",
    genre: "Nonfiction · Manufacturing",
    description:
      "A practical guide to robotic welding, covering MIG welding, resistance spot welding, and nut projection welding.",
    coverColor: "#3a3f4a",
  },
  {
    title: "Why I Can't Leave Islam",
    genre: "Nonfiction · Religion",
    description: "13 arguments exploring the author's relationship with faith.",
    coverColor: "#4a3a1f",
  },
  {
    title: "Bullseye Confidence",
    genre: "Nonfiction · Personal development",
    description: "Hit the exact mark in 20 high-stakes moments.",
    coverColor: "#1f3350",
    link: "https://a.co/d/0gnsd9NN",
  },
  {
    title: "The Down Syndrome Parenting Companion",
    genre: "Nonfiction · Parenting",
    description:
      "A story of love, courage, and raising a child with Down syndrome, age by age.",
    coverColor: "#5a4a2f",
    link: "https://a.co/d/05WOTgWK",
  },
  {
    title: "Math Is My Favorite",
    genre: "Children's nonfiction · Education",
    description:
      "A visual, household approach to mathematics, Standard 1 through 8.",
    coverColor: "#2f5a4a",
    link: "https://a.co/d/02aJhNjj",
  },
  {
    title: "The Confidence Prompt",
    genre: "Nonfiction · Personal development",
    description: "Reprogram your mind for unshakable confidence under pressure.",
    coverColor: "#1c2b45",
    link: "https://a.co/d/06aavGqd",
  },
  {
    title: "The Stress Experts",
    genre: "Psychological novel",
    description: "When the experts become the experiment.",
    coverColor: "#3a3a3a",
  },
];
