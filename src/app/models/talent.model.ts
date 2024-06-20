export interface Cost {
  readonly base: number;
  readonly power: number;
}

export interface StaticTalent {
  readonly cost: Cost;
  readonly reduction: number;
}

export interface ComputedTalent {
  level: number;
  cost: string;
  nextDuration: number;
  prevDurations: number[];
}

export interface ComputedTalentSet {
  featherGeneration: ComputedTalent;
  bonusesOfOrion: ComputedTalent;
  featherMultiplier: ComputedTalent;
  featherCheapener: ComputedTalent;
  featherRestart: ComputedTalent;
  superFeatherProduction: ComputedTalent;
  shinyFeathers: ComputedTalent;
  superFeatherCheapener: ComputedTalent;
  theGreatMegaReset: ComputedTalent;
}

export interface ComputedStatus {
  feathersPerSecond: string;
  totalShinyFeathers: number;
  talentSet: ComputedTalentSet;
}

export enum ToggleableTalent {
  FeatherRestart = 'featherRestart',
  TheGreatMegaReset = 'theGreatMegaReset',
  BonusesOfOrion = 'bonusesOfOrion',
}
