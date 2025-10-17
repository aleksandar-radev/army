import { resources } from "./resources.js";
import { armyCounts } from "./army.js";
import {
  buildingSpawnProgress,
  buildingStates,
  applyOfflineSummoning,
  applyOfflineGold,
  setSpawnProgress,
} from "./town.js";
import { artifactStates } from "./artifact.js";
import { GameMeta } from "./config.js";

const SAVE_KEY = "idleHeroSlayerSave";

export function createGameState() {
  return {
    version: GameMeta.version,
    timestamp: Date.now(),
    resources: { ...resources },
    armyCounts: { ...armyCounts },
    buildingStates: { ...buildingStates },
    spawnProgress: { ...buildingSpawnProgress },
    artifactStates: { ...artifactStates },
    killCount: 0,
  };
}

export async function loadGame() {
  try {
    const saveData = localStorage.getItem(SAVE_KEY);
    if (!saveData) {
      console.log("No save data found, starting new game");
      return false;
    }

    const gameState = JSON.parse(saveData);

    if (gameState.version !== GameMeta.version) {
      console.warn(
        `Save version mismatch: ${gameState.version} vs ${GameMeta.version}`
      );
    }

    Object.assign(resources, gameState.resources);

    Object.assign(armyCounts, gameState.armyCounts);

    Object.assign(buildingStates, gameState.buildingStates);
    setSpawnProgress(gameState.spawnProgress || {});

    Object.assign(artifactStates, gameState.artifactStates);

    if (gameState.killCount !== undefined) {
      const { setKillCount, startNewBattle } = await import("./battle.js");
      setKillCount(gameState.killCount);
      startNewBattle();
    }

    const lastTimestamp = Number(gameState.timestamp) || 0;
    if (lastTimestamp > 0) {
      const elapsedMs = Date.now() - lastTimestamp;
      if (elapsedMs > 0) {
        const elapsedSeconds = elapsedMs / 1000;
        const summonedUnits = applyOfflineSummoning(elapsedSeconds);
        const entries = Object.entries(summonedUnits).filter(([, count]) => count > 0);
        if (entries.length > 0) {
          const summary = entries
            .map(([unit, count]) => `${count} ${unit}${count === 1 ? "" : "s"}`)
            .join(", ");
          console.log(
            `Offline summoning produced ${summary} after ${Math.floor(elapsedSeconds)}s away.`,
          );
        }

        const offlineGold = applyOfflineGold(elapsedSeconds);
        if (offlineGold > 0) {
          const roundedGold = Math.round(offlineGold * 100) / 100;
          const formattedGold =
            typeof roundedGold.toLocaleString === "function"
              ? roundedGold.toLocaleString()
              : `${roundedGold}`;
          console.log(
            `Offline production generated ${formattedGold} gold after ${Math.floor(elapsedSeconds)}s away.`,
          );
        }
      }
    }

    console.log("Game loaded successfully");
    return true;
  } catch (error) {
    console.error("Failed to load game:", error);
    return false;
  }
}

let autoSaveInterval = null;

export function startAutoSave(intervalMs = 1000) {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }

  autoSaveInterval = setInterval(async () => {
    try {
      const { getKillCount } = await import("./battle.js");
      const gameState = createGameState();
      gameState.killCount = getKillCount();

      const saveData = JSON.stringify(gameState);
      localStorage.setItem(SAVE_KEY, saveData);
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, intervalMs);

  console.log(`Auto-save started with ${intervalMs}ms interval`);
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    console.log("Auto-save stopped");
  }
}

export function hasSaveData() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
  console.log("Save data cleared");
}
