export const SkillLevel = Object.freeze({
  Noob: 1,
  Beginner: 2,
  Intermediate: 3,
  Advanced: 4,
});

export type SkillLevel = (typeof SkillLevel)[keyof typeof SkillLevel];
