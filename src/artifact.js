import { ArtifactConfig } from "./config.js";
import { spendHeroSouls } from "./resources.js";

export const artifactStates = {};
for (const key in ArtifactConfig) {
  artifactStates[key] = 0;
}

export function getHeroSoulMultiplier(enemyLevel = 1) {
  const boosterTier = artifactStates["HeroSoulBooster"] || 0;
  return 1 + boosterTier * 0.1;
}

export function getArtifactTier(artifactKey) {
  return artifactStates[artifactKey];
}

export function getArtifactUpgradeCost(artifactKey) {
  const cfg = ArtifactConfig[artifactKey];
  const currentTier = artifactStates[artifactKey];
  if (cfg.maxTier !== undefined && currentTier >= cfg.maxTier) {
    return Infinity;
  }
  const rawCost = cfg.baseCost * Math.pow(cfg.costGrowth, currentTier);
  return Math.floor(rawCost);
}

export function upgradeArtifact(artifactKey) {
  const cfg = ArtifactConfig[artifactKey];
  const currentTier = artifactStates[artifactKey];
  if (cfg.maxTier !== undefined && currentTier >= cfg.maxTier) {
    return false;
  }
  const cost = getArtifactUpgradeCost(artifactKey);
  if (!isFinite(cost)) {
    return false;
  }
  if (!spendHeroSouls(cost)) {
    return false;
  }
  artifactStates[artifactKey] += 1;
  return true;
}

export function getAllArtifactKeys() {
  return Object.keys(ArtifactConfig);
}

export function getArtifactEffectBonus(effectType, unitType = null) {
  let total = 0;
  for (const key in ArtifactConfig) {
    const cfg = ArtifactConfig[key];
    const tier = artifactStates[key];
    if (tier <= 0) continue;
    if (cfg.effect !== effectType) continue;
    if (cfg.appliesTo && cfg.appliesTo !== unitType) continue;
    total += tier * cfg.effectValue;
  }
  return total;
}
