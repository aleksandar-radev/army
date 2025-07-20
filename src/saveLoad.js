// Save and Load functionality for the game
import { resources } from "./resources.js";
import { armyCounts } from "./army.js";
import { buildingStates } from "./town.js";
import { artifactStates } from "./artifact.js";
import { GameMeta } from "./config.js";

const SAVE_KEY = "idleHeroSlayerSave";

// Game state object structure
export function createGameState() {
  return {
    version: GameMeta.version,
    timestamp: Date.now(),
    resources: { ...resources },
    armyCounts: { ...armyCounts },
    buildingStates: { ...buildingStates },
    artifactStates: { ...artifactStates },
    // Battle state will be reconstructed on load since enemies are level-based
    killCount: 0 // This will be imported from battle.js when available
  };
}

// Load game state from localStorage
export async function loadGame() {
  try {
    const saveData = localStorage.getItem(SAVE_KEY);
    if (!saveData) {
      console.log("No save data found, starting new game");
      return false;
    }

    const gameState = JSON.parse(saveData);
    
    // Version check (for future compatibility)
    if (gameState.version !== GameMeta.version) {
      console.warn(`Save version mismatch: ${gameState.version} vs ${GameMeta.version}`);
      // For now, we'll still load the save but this could be used for migration
    }

    // Restore resources
    Object.assign(resources, gameState.resources);

    // Restore army counts
    Object.assign(armyCounts, gameState.armyCounts);

    // Restore building states
    Object.assign(buildingStates, gameState.buildingStates);

    // Restore artifact states
    Object.assign(artifactStates, gameState.artifactStates);

    // Restore battle state
    if (gameState.killCount !== undefined) {
      // Import and set kill count
      const { setKillCount, startNewBattle } = await import("./battle.js");
      setKillCount(gameState.killCount);
      startNewBattle();
    }

    console.log("Game loaded successfully");
    return true;
  } catch (error) {
    console.error("Failed to load game:", error);
    return false;
  }
}


// Auto-save functionality
let autoSaveInterval = null;

export function startAutoSave(intervalMs = 1000) {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
  
  autoSaveInterval = setInterval(async () => {
    try {
      // Get kill count dynamically
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

// Check if save data exists
export function hasSaveData() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

// Clear save data
export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
  console.log("Save data cleared");
}
