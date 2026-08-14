import theStressExperts from "@/assets/covers/the-stress-experts.jpeg";
import fromThePlantFloor from "@/assets/covers/from-the-plant-floor.jpeg";
import theQuestionKids from "@/assets/covers/the-question-kids.jpeg";
import mathIsMyFavorite from "@/assets/covers/math-is-my-favorite.jpeg";
import richHabitsYoungMinds from "@/assets/covers/rich-habits-young-minds.jpeg";
import downSyndromeParentingCompanion from "@/assets/covers/down-syndrome-parenting-companion.jpeg";
import theGodman from "@/assets/covers/the-godman.jpeg";
import theClosingNumber from "@/assets/covers/the-closing-number.jpeg";
import aMemoryOfSmell from "@/assets/covers/a-memory-of-smell.jpeg";
import mirroredFalls from "@/assets/covers/mirrored-falls.jpeg";
import theGirlWhoSawInTheDark from "@/assets/covers/the-girl-who-saw-in-the-dark.jpeg";
import theTradesAiCantTouch from "@/assets/covers/the-trades-ai-cant-touch.jpeg";
import aiEdge from "@/assets/covers/ai-edge.jpeg";
import whyICantLeaveIslam from "@/assets/covers/why-i-cant-leave-islam.jpeg";
import bullseyeConfidence from "@/assets/covers/bullseye-confidence.jpeg";
import theConfidencePrompt from "@/assets/covers/the-confidence-prompt.jpeg";
import mercies from "@/assets/covers/mercies.jpeg";
import limbicMemory from "@/assets/covers/limbic-memory.jpeg";
import theEmperorsWit from "@/assets/covers/the-emperors-wit.jpeg";
import thirstyOrchid from "@/assets/covers/thirsty-orchid.jpeg";
import lavender from "@/assets/covers/lavender.jpeg";
import habitsMisunderstood from "@/assets/covers/habits-misunderstood.jpeg";
export interface Review {
  name: string;
  rating: number;
  comment: string;
}

export type Category = "Fiction" | "Children's" | "Nonfiction";

export interface MarketLinks {
  us?: string;
  ca?: string;
  in?: string;
}

export interface Book {
  title: string;
  description: string;
  genre: string;
  category: Category;
  coverColor: string;
  links?: MarketLinks;
  cover?: string;
  reviews?: Review[];
}

export const books: Book[] = [
  // --- Fiction ---
  {
    title: "The Godman",
    genre: "Literary crime thriller",
    category: "Fiction",
    description:
      "A literary crime thriller that explores a morally complex world and refuses an easy ending.",
    coverColor: "#5c1a24",
    links: {
      us: "https://a.co/d/0jc9dvv4",
      ca: "https://a.co/d/05Fbek9G",
      in: "https://amzn.in/d/02qSpa5E",
    },
    cover: theGodman,
  },
  {
    title: "The Closing Number",
    genre: "Mystery · Hong Kong",
    category: "Fiction",
    description: "A mystery set in Hong Kong, following a case that closes in on more than one suspect.",
    coverColor: "#1f3b3a",
    cover: theClosingNumber,
  },
  {
    title: "A Memory of Smell",
    genre: "Thriller · Prague",
    category: "Fiction",
    description: "A Prague-set thriller where the past resurfaces through the senses.",
    coverColor: "#1c2b4a",
    links: {
      us: "https://a.co/d/07YGSOM9",
      ca: "https://a.co/d/0iaH3kWH",
      in: "https://amzn.in/d/05168vt3",
    },
    cover: aMemoryOfSmell,
  },
  {
    title: "Mirrored Falls",
    genre: "Literary novel · English & Hindustani Hindi",
    category: "Fiction",
    description:
      "A literary novel published in both English and Hindustani Hindi editions.",
    coverColor: "#3a2b1c",
    links: {
      us: "https://a.co/d/02PlJtVn",
      ca: "https://a.co/d/06awf1fk",
      in: "https://amzn.in/d/0d57mADx",
    },
    cover: mirroredFalls,
  },
  {
    title: "The Stress Experts",
    genre: "Psychological novel",
    category: "Fiction",
    description: "When the experts become the experiment.",
    coverColor: "#3a3a3a",
    links: {
      us: "https://a.co/d/04ofurUE",
      ca: "https://a.co/d/0aWQVTQZ",
      in: "https://amzn.in/d/0dTChgBt",
    },
    cover: theStressExperts,
  },
  {
    title: "Mercies",
    genre: "Historical fiction · Ancient Egypt",
    category: "Fiction",
    description:
      "A novel of magic, medicine, and faith in ancient Egypt.",
    coverColor: "#8a7228",
    links: {
      us: "https://a.co/d/08CKeKUr",
      ca: "https://a.co/d/0gXaF0yG",
      in: "https://amzn.in/d/06tXjlaX",
    },
    cover: mercies,
  },
  {
    title: "The Emperor's Wit",
    genre: "Historical fiction · Mughal India",
    category: "Fiction",
    description:
      "A novel of Akbar and Birbal — the wisdom that built an empire.",
    coverColor: "#1c3a24",
    links: {
      us: "https://a.co/d/0iY0GFRS",
      ca: "https://a.co/d/0byI5cpR",
      in: "https://amzn.in/d/05dycbPf",
    },
    cover: theEmperorsWit,
  },
  {
    title: "Thirsty Orchid",
    genre: "Literary thriller",
    category: "Fiction",
    description:
      "Three men came for a discovery. None of them understood the price.",
    coverColor: "#5f6e4f",
    links: {
      us: "https://a.co/d/0eoqCIDg",
      ca: "https://a.co/d/02YTUm6a",
      in: "https://amzn.in/d/08EGfyD2",
    },
    cover: thirstyOrchid,
  },
  {
    title: "Lavender",
    genre: "Literary novel",
    category: "Fiction",
    description: "The scar was never the problem.",
    coverColor: "#3d2c4f",
    links: {
      us: "https://a.co/d/06Cf2pYD",
      ca: "https://a.co/d/09iDK8UC",
      in: "https://amzn.in/d/029exSDb",
    },
    cover: lavender,
  },

  // --- Children's ---
  {
    title: "The Girl Who Saw in the Dark",
    genre: "Middle-grade novel",
    category: "Children's",
    description:
      "A middle-grade novel about a girl with night blindness who builds a company from her greatest challenge.",
    coverColor: "#4a3b1f",
    links: {
      us: "https://a.co/d/0gA1pMoT",
      ca: "https://a.co/d/04hev5te",
      in: "https://amzn.in/d/01IMbOA3",
    },
    cover: theGirlWhoSawInTheDark,
  },
  {
    title: "Rich Habits, Young Minds",
    genre: "Financial literacy · Family",
    category: "Children's",
    description:
      "A financial literacy book following one family through five money lessons.",
    coverColor: "#2f4a2b",
    links: {
      us: "https://a.co/d/0hSYeQ9S",
      ca: "https://a.co/d/0dqT0vDA",
    },
    cover: richHabitsYoungMinds,
  },
  {
    title: "The Question Kids",
    genre: "Children's nonfiction",
    category: "Children's",
    description: "Introduces young readers to six real-world inventors.",
    coverColor: "#5a2f4a",
    links: {
      us: "https://a.co/d/02uMP6Vt",
      ca: "https://a.co/d/0bkcfuMb",
      in: "https://amzn.in/d/0hoK0Z9R",
    },
    cover: theQuestionKids,
  },
  {
    title: "Math Is My Favorite",
    genre: "Children's nonfiction · Education",
    category: "Children's",
    description:
      "A visual, household approach to mathematics, Standard 1 through 8.",
    coverColor: "#2f5a4a",
    links: {
      us: "https://a.co/d/0aaqzwMN",
      ca: "https://a.co/d/03QruQQC",
      in: "https://amzn.in/d/05w3PJ3s",
    },
    cover: mathIsMyFavorite,
  },

  // --- Nonfiction ---
  {
    title: "The Trades AI Can't Touch",
    genre: "Nonfiction · Skilled trades",
    category: "Nonfiction",
    description:
      "Six industrial trades powering Canada and the United States, and the human judgment behind them that can't be automated.",
    coverColor: "#6b1f28",
    links: {
      us: "https://a.co/d/0agmAQQ7",
      ca: "https://a.co/d/090Y16Sn",
      in: "https://amzn.in/d/0fUvFVi2",
    },
    cover: theTradesAiCantTouch,
  },
  {
    title: "AI Edge",
    genre: "Nonfiction · Trading & AI",
    category: "Nonfiction",
    description:
      "A day trader's playbook for using AI to find opportunities, execute with precision, and manage risk like a pro.",
    coverColor: "#1f4a3a",
    links: {
      us: "https://a.co/d/0a1mrfb1",
      ca: "https://a.co/d/0bhsj2yP",
      in: "https://amzn.in/d/0g7wy3Iq",
    },
    cover: aiEdge,
  },
  {
    title: "From the Plant Floor",
    genre: "Nonfiction · Manufacturing",
    category: "Nonfiction",
    description:
      "A practical guide to robotic welding, covering MIG welding, resistance spot welding, and nut projection welding.",
    coverColor: "#3a3f4a",
    links: {
      us: "https://a.co/d/0eZlwnpb",
      ca: "https://a.co/d/0bHf4DRb",
      in: "https://amzn.in/d/0euvkFxQ",
    },
    cover: fromThePlantFloor,
  },
  {
    title: "Why I Can't Leave Islam",
    genre: "Nonfiction · Religion",
    category: "Nonfiction",
    description: "13 arguments exploring the author's relationship with faith.",
    coverColor: "#4a3a1f",
    links: {
      us: "https://a.co/d/0ijZQUBs",
      ca: "https://a.co/d/0bUix0oV",
      in: "https://amzn.in/d/06ZPvPJY",
    },
    cover: whyICantLeaveIslam,
  },
  {
    title: "Bullseye Confidence",
    genre: "Nonfiction · Personal development",
    category: "Nonfiction",
    description: "Hit the exact mark in 20 high-stakes moments.",
    coverColor: "#1f3350",
    links: {
      us: "https://a.co/d/0bAUxCbl",
      ca: "https://a.co/d/0gr2fLVl",
      in: "https://amzn.in/d/0a1JF7ei",
    },
    cover: bullseyeConfidence,
  },
  {
    title: "The Down Syndrome Parenting Companion",
    genre: "Nonfiction · Parenting",
    category: "Nonfiction",
    description:
      "A story of love, courage, and raising a child with Down syndrome, age by age.",
    coverColor: "#5a4a2f",
    links: {
      us: "https://a.co/d/04uJHlx0",
      ca: "https://a.co/d/03vNNGT2",
      in: "https://amzn.in/d/0aHQCu5M",
    },
    cover: downSyndromeParentingCompanion,
  },
  {
    title: "The Confidence Prompt",
    genre: "Nonfiction · Personal development",
    category: "Nonfiction",
    description: "Reprogram your mind for unshakable confidence under pressure.",
    coverColor: "#1c2b45",
    links: {
      us: "https://a.co/d/0eXS8MWu",
      ca: "https://a.co/d/0ipOY5sj",
      in: "https://amzn.in/d/0i41O8fr",
    },
    cover: theConfidencePrompt,
  },
  {
    title: "Limbic Memory",
    genre: "Nonfiction · Neuroscience & memory",
    category: "Nonfiction",
    description:
      "A story-driven guide to the brain's limbic system — the amygdala, the hippocampus, and the machinery that decides what gets remembered and what quietly disappears — and how to build a lasting mental architecture for the things that deserve to be unforgettable.",
    coverColor: "#16262b",
    links: {
      us: "https://a.co/d/0g0xMG9n",
      ca: "https://a.co/d/09sGI46v",
      in: "https://amzn.in/d/07KjRXBf",
    },
    cover: limbicMemory,
  },
  {
    title: "Habits, Misunderstood",
    genre: "Nonfiction · Psychology & habits",
    category: "Nonfiction",
    description: "What we were never told about why habits survive.",
    coverColor: "#1c3440",
    links: {
      us: "https://a.co/d/03S7Lwa0",
      ca: "https://a.co/d/04Twhg6z",
      in: "https://amzn.in/d/0bd8H5so",
    },
    cover: habitsMisunderstood,
  },
];
