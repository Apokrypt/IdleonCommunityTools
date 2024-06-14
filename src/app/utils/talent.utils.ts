import {
  ComputedTalentSet,
  StaticTalent,
  ComputedStatus,
  ToggleableTalent,
} from '../models/talent.model';
import { truncateNumber } from './math.utils';

export const STATIC_FEATHER_GENERATION: StaticTalent = {
  cost: {
    base: 5,
    power: 1.075,
  },
  // requires FrostRavenMegaFeather
  reduction: 0.01,
};
export const STATIC_BONUSES_OF_ORION: StaticTalent = {
  cost: {
    base: 350,
    power: 25,
  },
  reduction: 0,
};
export const STATIC_FEATHER_MULTIPLIER: StaticTalent = {
  cost: {
    base: 500,
    power: 1.11,
  },
  reduction: 0,
};
export const STATIC_FEATHER_CHEAPENER: StaticTalent = {
  cost: {
    base: 3000,
    power: 1.16,
  },
  reduction: 0.1,
};
export const STATIC_FEATHER_RESTART: StaticTalent = {
  cost: {
    base: 1000000,
    power: 14,
  },
  reduction: 0,
};
export const STATIC_SUPER_FEATHER_PRODUCTION: StaticTalent = {
  cost: {
    base: 2000000,
    power: 1.12,
  },
  reduction: 0,
};
export const STATIC_SHINY_FEATHERS: StaticTalent = {
  cost: {
    base: 5000000,
    power: 1.4,
  },
  reduction: 0,
};
export const STATIC_SUPER_FEATHER_CHEAPENER: StaticTalent = {
  cost: {
    base: 50000000,
    power: 1.27,
  },
  reduction: 0.2,
};
export const STATIC_THE_GREAT_MEGA_RESET: StaticTalent = {
  cost: {
    base: 250000000000,
    power: 20,
  },
  reduction: 0,
};

export const STATIC_TALENT = {
  featherGeneration: STATIC_FEATHER_GENERATION,
  bonusesOfOrion: STATIC_BONUSES_OF_ORION,
  featherMultiplier: STATIC_FEATHER_MULTIPLIER,
  featherCheapener: STATIC_FEATHER_CHEAPENER,
  featherRestart: STATIC_FEATHER_RESTART,
  superFeatherProduction: STATIC_SUPER_FEATHER_PRODUCTION,
  shinyFeathers: STATIC_SHINY_FEATHERS,
  superFeatherCheapener: STATIC_SUPER_FEATHER_CHEAPENER,
  theGreatMegaReset: STATIC_THE_GREAT_MEGA_RESET,
};

export const ALL_TALENTS = [
  'featherGeneration',
  'bonusesOfOrion',
  'featherMultiplier',
  'featherCheapener',
  'featherRestart',
  'superFeatherProduction',
  'shinyFeathers',
  'superFeatherCheapener',
  'theGreatMegaReset',
] as const;

export const PASSIVE_TALENTS = [
  'featherGeneration',
  'featherMultiplier',
  'featherCheapener',
  'superFeatherProduction',
  'shinyFeathers',
  'superFeatherCheapener',
] as const;

export function calculateBaseCostByLevel(
  level: number,
  talent: StaticTalent
): number {
  return talent.cost.base * Math.pow(talent.cost.power, level);
}

/**
 * FeatherGeneration uses different formula to calculate the base cost by level.
 */
export function calculateBaseCostByLevel2(
  level: number,
  talent: StaticTalent
): number {
  return level * calculateBaseCostByLevel(level, talent);
}

export function calculateCostMultiplier(
  level: number,
  talent: StaticTalent
): number {
  return 1 / (1 + talent.reduction * level);
}

function calculateBaseFeathersPerSecond(
  computedTalentSet: ComputedTalentSet
): number {
  const {
    featherGeneration,
    featherCheapener,
    superFeatherProduction,
    superFeatherCheapener,
  } = computedTalentSet;

  const hasObsidianMegaFeather = true;

  if (hasObsidianMegaFeather) {
    // feather generation gives 1 feather per second per level
    return (
      featherGeneration.level +
      superFeatherProduction.level * 5 +
      featherCheapener.level * 2 +
      superFeatherCheapener.level * 4
    );
  }
  return featherGeneration.level * 1 + superFeatherProduction.level * 5;
}

function calculateFeatherRestartMultiplier(
  computedTalentSet: ComputedTalentSet
): number {
  const { featherRestart } = computedTalentSet;
  const hasPristineMegaFeather = true;
  return Math.pow(hasPristineMegaFeather ? 5 : 3, featherRestart.level);
}

function calculateFeatherMultiplierMultiplier(
  computedTalentSet: ComputedTalentSet
): number {
  return 1 + computedTalentSet.featherMultiplier.level * 0.05;
}

function calculateShinyFeathersMultiplier(
  computedStatus: ComputedStatus
): number {
  const { totalShinyFeathers, talentSet } = computedStatus;
  return 1 + totalShinyFeathers * talentSet.shinyFeathers.level * 0.01;
}

/**
 * Gains per second
 */
function calculateFeathersPerSecond(computedStatus: ComputedStatus): number {
  const hasMapleMegaFeather = true;
  const feathersPerSecond =
    calculateBaseFeathersPerSecond(computedStatus.talentSet) *
    calculateFeatherRestartMultiplier(computedStatus.talentSet) *
    calculateFeatherMultiplierMultiplier(computedStatus.talentSet) *
    calculateShinyFeathersMultiplier(computedStatus);
  if (hasMapleMegaFeather) {
    return feathersPerSecond * 10;
  }
  return feathersPerSecond;
}

function calculateNextLevelCost(
  level: number,
  talent: StaticTalent,
  computedSet: ComputedTalentSet
): number {
  const { featherGeneration, featherCheapener, superFeatherCheapener } =
    computedSet;
  const baseCost =
    talent === STATIC_FEATHER_GENERATION
      ? calculateBaseCostByLevel2(level, talent)
      : calculateBaseCostByLevel(level, talent);
  const featherCost =
    baseCost *
    calculateCostMultiplier(
      featherGeneration.level,
      STATIC_FEATHER_GENERATION
    ) *
    calculateCostMultiplier(featherCheapener.level, STATIC_FEATHER_CHEAPENER) *
    calculateCostMultiplier(
      superFeatherCheapener.level,
      STATIC_SUPER_FEATHER_CHEAPENER
    );
  return featherCost;
}

/**
 * returns the duration to reach cost in milliseconds.
 */
function calculateDurationToReachCost(
  cost: number,
  feathersPerSecond: number
): number {
  return (cost / feathersPerSecond) * 1000;
}

function createComputedTalentSet(args: {
  bonusesOfOrionLevel: number;
  featherRestartLevel: number;
  theGreatMegaResetLevel: number;
}): ComputedTalentSet {
  const { bonusesOfOrionLevel, featherRestartLevel, theGreatMegaResetLevel } =
    args;
  const computedSet = {
    featherGeneration: {
      level: 1,
      cost: '0',
      duration: 0,
    },
    bonusesOfOrion: {
      level: bonusesOfOrionLevel,
      cost: '0',
      duration: 0,
    },
    featherMultiplier: {
      level: 0,
      cost: '0',
      duration: 0,
    },
    featherCheapener: {
      level: 0,
      cost: '0',
      duration: 0,
    },
    featherRestart: {
      level: featherRestartLevel,
      cost: '0',
      duration: 0,
    },
    superFeatherProduction: {
      level: 0,
      cost: '0',
      duration: 0,
    },
    shinyFeathers: {
      level: 0,
      cost: '0',
      duration: 0,
    },
    superFeatherCheapener: {
      level: 0,
      cost: '0',
      duration: 0,
    },
    theGreatMegaReset: {
      level: theGreatMegaResetLevel,
      cost: '0',
      duration: 0,
    },
  };
  return computedSet;
}

function createComputedStatus(args: {
  bonusesOfOrionLevel: number;
  featherRestartLevel: number;
  theGreatMegaResetLevel: number;
  totalShinyFeathers: number;
}): ComputedStatus {
  const { totalShinyFeathers } = args;
  return {
    feathersPerSecond: '0',
    totalShinyFeathers,
    talentSet: createComputedTalentSet(args),
  };
}

function calculateProfit(
  targetTalent: `${ToggleableTalent}`,
  talentName: keyof ComputedTalentSet,
  computedStatus: ComputedStatus
): number {
  const { talentSet } = computedStatus;

  // Target talent is the talent we want to level up and calculate the optimal talent levels for.
  const targetTalentStatic = STATIC_TALENT[targetTalent];
  const targetTalentInstance = talentSet[targetTalent];

  const talentStatic = STATIC_TALENT[talentName];
  const talentInstance = talentSet[talentName];

  const feathersPerSecond = calculateFeathersPerSecond(computedStatus);
  const targetNextLevelCost = calculateNextLevelCost(
    targetTalentInstance.level,
    targetTalentStatic,
    talentSet
  );
  const targetNextLevelDuration = calculateDurationToReachCost(
    targetNextLevelCost,
    feathersPerSecond
  );
  /**
   * Calculates the cost of the next level
   */
  const nextLevelCost = calculateNextLevelCost(
    talentInstance.level,
    talentStatic,
    talentSet
  );
  /**
   * Calculate the duration it would take to reach that level
   */
  const nextLevelDuration = calculateDurationToReachCost(
    nextLevelCost,
    feathersPerSecond
  );
  /**
   * Adding level directly as it's faster than making a clone, this level will be removed if the result is not positive.
   */
  talentInstance.level = talentInstance.level + 1;

  const feathersPerSecondAfter = calculateFeathersPerSecond(computedStatus);
  const targetNextLevelCostAfter = calculateNextLevelCost(
    targetTalentInstance.level,
    targetTalentStatic,
    talentSet
  );
  const targetNextLevelDurationAfter = calculateDurationToReachCost(
    targetNextLevelCostAfter,
    feathersPerSecondAfter
  );

  talentInstance.level = talentInstance.level - 1;

  // Calculates the profit in percentages
  return (
    (targetNextLevelDuration -
      (targetNextLevelDurationAfter + nextLevelDuration)) /
    targetNextLevelDuration
  );
}

function getTheMostProfitableTalent(
  targetTalent: `${ToggleableTalent}`,
  computedStatus: ComputedStatus
): {
  talentName: keyof ComputedTalentSet;
  profit: number;
} {
  const result = PASSIVE_TALENTS.map((talentName) => ({
    talentName,
    profit: calculateProfit(targetTalent, talentName, computedStatus),
  }))
    .sort(({ profit: profitA }, { profit: profitB }) => profitA - profitB)
    .pop();
  if (result === undefined) {
    throw Error(
      `something went wrong, couldn't find the most valueable talent`
    );
  }
  return result;
}

/**
 * impure
 */
function calculateTalentLevels(
  targetTalent: `${ToggleableTalent}`,
  computedStatus: ComputedStatus
): ComputedStatus {
  let changesAreMade = true;
  let count = 0;

  while (changesAreMade) {
    changesAreMade = false;

    const { talentName, profit } = getTheMostProfitableTalent(
      targetTalent,
      computedStatus
    );

    // 0.01% minimum profit
    if (profit > 0.0001) {
      const talentInstance = computedStatus.talentSet[talentName];
      talentInstance.level = talentInstance.level + 1;
      changesAreMade = true;
    }
    // failsafe
    if (count === 100000) {
      changesAreMade = false;
      console.log('maximum count has been reached!');
    }
    count++;
  }
  return computedStatus;
}

function getBaseLog(x: number, y: number) {
  return Math.log(y) / Math.log(x);
}

function calculateTotalShinyFeathers(computedStatus: ComputedStatus): number {
  const feathersPerSecond = calculateFeathersPerSecond(computedStatus);
  const target = 0.00001;
  const chance = 0.01;
  const totalShinyFeathers = Math.floor(
    getBaseLog(1.1, feathersPerSecond * (target / chance))
  );
  return totalShinyFeathers;
}

function computeTalentsAndShinyFeathers(args: {
  targetTalent: `${ToggleableTalent}`;
  bonusesOfOrionLevel: number;
  featherRestartLevel: number;
  theGreatMegaResetLevel: number;
}): ComputedStatus {
  const { targetTalent } = args;

  let computedStatus: ComputedStatus | undefined;
  let changesAreMade = true;
  let count = 0;
  let totalShinyFeathers = 1;

  while (changesAreMade) {
    changesAreMade = false;

    computedStatus = createComputedStatus({ totalShinyFeathers, ...args });

    calculateTalentLevels(targetTalent, computedStatus);

    const nextTotalShinyFeathers = calculateTotalShinyFeathers(computedStatus);

    if (nextTotalShinyFeathers > totalShinyFeathers) {
      totalShinyFeathers = nextTotalShinyFeathers;
      changesAreMade = true;
    } else if (nextTotalShinyFeathers < totalShinyFeathers) {
      throw Error(
        `Something unexpected happened, the new shiny feather count is less than previous`
      );
    }
    // failsafe
    if (count === 100000) {
      changesAreMade = false;
      console.log('maximum count has been reached!');
    }
    count++;
  }
  if (computedStatus === undefined) {
    throw Error(
      `Something unexpected happened, ComputedStatus was not initialized properly.`
    );
  }
  return computedStatus;
}

export function computeStatus(args: {
  targetTalent: `${ToggleableTalent}`;
  bonusesOfOrionLevel: number;
  featherRestartLevel: number;
  theGreatMegaResetLevel: number;
}): ComputedStatus {
  const computedStatus = computeTalentsAndShinyFeathers(args);

  // Add cost and duration

  const feathersPerSecond = calculateFeathersPerSecond(computedStatus);

  computedStatus.feathersPerSecond = truncateNumber(feathersPerSecond);

  for (const talentName of ALL_TALENTS) {
    const talentStatic = STATIC_TALENT[talentName];
    const talentInstance = computedStatus.talentSet[talentName];
    const cost = calculateNextLevelCost(
      talentInstance.level,
      talentStatic,
      computedStatus.talentSet
    );
    talentInstance.cost = truncateNumber(cost);
    talentInstance.duration = calculateDurationToReachCost(
      cost,
      feathersPerSecond
    );
  }
  return computedStatus;
}
