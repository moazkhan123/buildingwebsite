export const sampleLoaders: Partial<Record<string, () => Promise<string[]>>> = {
  "The Godman": () =>
    import("@/data/samples/the-godman").then((m) => m.theGodmanSample),
  "The Stress Experts": () =>
    import("@/data/samples/the-stress-experts").then((m) => m.theStressExpertsSample),
  "AI Edge": () => import("@/data/samples/ai-edge").then((m) => m.aiEdgeSample),
  "Why I Can't Leave Islam": () =>
    import("@/data/samples/why-i-cant-leave-islam").then((m) => m.whyICantLeaveIslamSample),
  "Thirsty Orchid": () =>
    import("@/data/samples/thirsty-orchid").then((m) => m.thirstyOrchidSample),
  Lavender: () => import("@/data/samples/lavender").then((m) => m.lavenderSample),
  "The Question Kids": () =>
    import("@/data/samples/the-question-kids").then((m) => m.theQuestionKidsSample),
  "Bullseye Confidence": () =>
    import("@/data/samples/bullseye-confidence").then((m) => m.bullseyeConfidenceSample),
  "The Down Syndrome Parenting Companion": () =>
    import("@/data/samples/down-syndrome-parenting-companion").then(
      (m) => m.downSyndromeParentingCompanionSample,
    ),
  Mercies: () => import("@/data/samples/mercies").then((m) => m.merciesSample),
  "The Emperor's Wit": () =>
    import("@/data/samples/the-emperors-wit").then((m) => m.theEmperorsWitSample),
};
