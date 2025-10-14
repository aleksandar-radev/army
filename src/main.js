import {
  attack,
  getCurrentEnemy,
  getKillCount,
  startNewBattle,
} from "./battle.js";
import {
  getCombinedHp,
  getCombinedDmg,
  getUnitCount,
  addUnits,
} from "./army.js";
import { getUnitEffectiveHp, getUnitEffectiveDmg } from "./unitHelpers.js";
import {
  getGold,
  getHeroSoulsStored,
  getHeroSoulsTotal,
  resources,
} from "./resources.js";
import {
  buildingStates,
  getUpgradeCost,
  upgradeBuilding,
  tickTown,
  getBuildingLevel,
} from "./town.js";
import {
  getArtifactTier,
  getArtifactUpgradeCost,
  upgradeArtifact,
  getAllArtifactKeys,
} from "./artifact.js";
import { canPrestige, doPrestige } from "./prestige.js";
import { TickConfig } from "./config.js";
import { loadGame, startAutoSave, clearSave } from "./saveLoad.js";

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("gold-label").textContent = "Gold:";

  document.getElementById("btn-tab-battle").textContent = "Battle";
  document.getElementById("btn-tab-army").textContent = "Army";
  document.getElementById("btn-tab-town").textContent = "Town";
  document.getElementById("btn-tab-prestige").textContent = "Prestige";

  document.getElementById("battle-title").textContent = "Battle";
  document.getElementById("attack-button").textContent = "Attack";

  document.getElementById("army-title").textContent = "Army";
  document.getElementById("town-title").textContent = "Town";
  document.getElementById("relics-subtitle").textContent = "Relics";
  document.getElementById("prestige-subtitle").textContent = "Prestige";
  document.getElementById("btn-prestige").textContent = "Prestige";

  resources.gold = 1000;

  const gameLoaded = await loadGame();
  if (!gameLoaded) {
    console.log("Starting new game with default values");
  }

  const tabButtons = document.querySelectorAll("#nav-buttons .nav-btn");
  const tabViews = document.querySelectorAll(".tab-view");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabViews.forEach((v) => v.classList.remove("active"));
      btn.classList.add("active");
      const tabName = btn.getAttribute("data-tab");
      document.getElementById(`${tabName}-view`).classList.add("active");
      if (tabName === "battle") renderBattleView();
      else if (tabName === "army") renderArmyView();
      else if (tabName === "town") renderTownView();
      else if (tabName === "prestige") renderPrestigeView();
    });
  });

  document.querySelector('#nav-buttons .nav-btn[data-tab="battle"]').click();

  const attackBtn = document.getElementById("attack-button");
  attackBtn.addEventListener("click", () => {
    const result = attack();
    const enemyInfoDiv = document.getElementById("enemy-info");
    const battleLogDiv = document.getElementById("battle-log");

    if (result.killed) {
      battleLogDiv.textContent = `Enemy defeated! You gained ${result.storedSoulsGained.toFixed(
        1
      )} hero souls and ${result.goldGained.toLocaleString()} gold.`;

      startNewBattle();
      const enemy = getCurrentEnemy();
      if (enemy) {
        enemyInfoDiv.innerHTML = `🧑‍🎤 <strong>Level ${enemy.getLevel()}</strong> &nbsp; | &nbsp; HP: ${enemy
          .getCurrentHp()
          .toFixed(1)} / ${enemy
          .getMaxHp()
          .toFixed(1)} &nbsp; | &nbsp; DMG: ${enemy.getDmg().toFixed(1)}`;
      }
      updateSidebarStats();
    } else {
      const { enemyHpAfterAttack, retaliation } = result;
      let logMsg = `You dealt damage. Enemy HP is now ${enemyHpAfterAttack.toFixed(
        1
      )}.\n`;
      if (retaliation.type) {
        if (retaliation.unitsLost > 0) {
          logMsg += `Enemy retaliated and killed ${retaliation.unitsLost} ${
            retaliation.type
          }${retaliation.unitsLost > 1 ? "s" : ""}.`;
        } else {
          logMsg += `Enemy retaliated but did not kill any ${retaliation.type}.`;
        }
      } else {
        logMsg += `Enemy could not retaliate (no units).`;
      }
      battleLogDiv.textContent = logMsg;
      const enemy = getCurrentEnemy();
      if (enemy) {
        enemyInfoDiv.innerHTML = `🧑‍🎤 <strong>Level ${enemy.getLevel()}</strong> &nbsp; | &nbsp; HP: ${enemy
          .getCurrentHp()
          .toFixed(1)} / ${enemy
          .getMaxHp()
          .toFixed(1)} &nbsp; | &nbsp; DMG: ${enemy.getDmg().toFixed(1)}`;
      }
    }

    renderPrestigeView();
    renderArmyView();
  });

  setInterval(() => {
    tickTown();
    renderTownView();
    renderArmyView();
  }, TickConfig.intervalMs);

  startAutoSave(1000);

  function renderBattleView() {
    const enemyInfoDiv = document.getElementById("enemy-info");
    const enemy = getCurrentEnemy();
    if (enemy) {
      enemyInfoDiv.innerHTML = `🧑‍🎤 <strong>Level ${enemy.getLevel()}</strong> &nbsp; | &nbsp; HP: ${enemy
        .getCurrentHp()
        .toFixed(1)} / ${enemy
        .getMaxHp()
        .toFixed(1)} &nbsp; | &nbsp; DMG: ${enemy.getDmg().toFixed(1)}`;
    }
    document.getElementById("battle-log").textContent = "";
  }

  function renderArmyView() {
    const armyListDiv = document.getElementById("army-list");
    armyListDiv.innerHTML = "";
    const unitTypes = ["Goblin", "Orc", "Troll", "Ogre", "Dragon"];
    unitTypes.forEach((type) => {
      const unitCount = getUnitCount(type);
      if (unitCount === 0) return;

      const unitHp = getUnitEffectiveHp(type);
      const unitDmg = getUnitEffectiveDmg(type);
      const totalHp = unitHp * unitCount;
      const totalDmg = unitDmg * unitCount;

      const unitIcons = {
        Goblin: "👺",
        Orc: "🪓",
        Troll: "🧌",
        Ogre: "🏯",
        Dragon: "🐉",
      };
      const icon = unitIcons[type] || "🛡️";

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
  <div class="unit-box">
    <div class="unit-title-row">
      <div class="unit-title">${icon} ${type}</div>
      <div class="unit-subtitle">HP ${unitHp.toFixed(
        1
      )} | DMG ${unitDmg.toFixed(1)}</div>
    </div>
    <div class="unit-info-row">
      <div class="info-label">👥 Count</div>
      <div class="info-value">${unitCount.toLocaleString()}</div>
    </div>
    <div class="unit-info-row">
      <div class="info-label">❤️ Total HP</div>
      <div class="info-value">${totalHp.toFixed(1)}</div>
    </div>
    <div class="unit-info-row">
      <div class="info-label">⚔️ Total DMG</div>
      <div class="info-value">${totalDmg.toFixed(1)}</div>
    </div>
  </div>
`;

      armyListDiv.appendChild(card);
    });
  }

  function renderTownView() {
    const townListDiv = document.getElementById("town-list");
    townListDiv.innerHTML = "";
    for (const key in buildingStates) {
      const level = getBuildingLevel(key);
      const cost = getUpgradeCost(key);
      const item = document.createElement("div");
      item.className = "building-item";

      const name = document.createElement("span");
      const buildingIcons = {
        GoldMine: "⛏️",
        GoblinHut: "👺",
        OrcCamp: "🪓",
        TrollDen: "🧌",
        OgreTower: "🏯",
        DragonRoost: "🐉",
      };

      const icon = buildingIcons[key] || "🏗️";
      name.innerHTML = `${icon} ${key} <span style="opacity: 0.6;">(Level ${level})</span>`;

      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = `Upgrade (${cost} gold)`;
      btn.disabled = getGold() < cost;
      btn.addEventListener("click", () => {
        if (upgradeBuilding(key)) {
          renderTownView();
          renderArmyView();
        }
      });

      item.append(name, btn);
      townListDiv.appendChild(item);
    }
    updateSidebarStats();
  }

  function renderPrestigeView() {
    const relicsListDiv = document.getElementById("relics-list");
    relicsListDiv.innerHTML = "";
    getAllArtifactKeys().forEach((key) => {
      const tier = getArtifactTier(key);
      const cost = getArtifactUpgradeCost(key);
      const item = document.createElement("div");
      item.className = "artifact-item";

      const name = document.createElement("span");
      const artifactIcons = {
        GoldenTouch: "🪙",
        StartingGoldBoost: "💰",
        HeroSoulBooster: "🔥",
        GoblinPower: "👺",
        OrcPower: "🪓",
        TrollPower: "🧌",
        OgrePower: "🏯",
        DragonPower: "🐉",
        GoblinSummon: "👺",
        OrcSummon: "🪓",
        TrollSummon: "🧌",
        OgreSummon: "🏯",
        DragonSummon: "🐉",
      };

      const icon = artifactIcons[key] || "🔮";
      name.innerHTML = `${icon} ${key} <span style="opacity: 0.6;">(Tier ${tier})</span>`;

      const btn = document.createElement("button");
      btn.className = "btn";
      btn.textContent = cost === Infinity ? "Maxed" : `Upgrade (${cost} souls)`;
      btn.disabled = cost === Infinity || getHeroSoulsTotal() < cost;
      btn.addEventListener("click", () => {
        if (upgradeArtifact(key)) {
          renderPrestigeView();
        }
      });

      item.append(name, btn);
      relicsListDiv.appendChild(item);
    });

    document.getElementById(
      "hero-souls-display"
    ).innerHTML = `after prestige:<br>${getHeroSoulsStored().toFixed(1)} souls`;

    const infoDiv = document.getElementById("prestige-info");
    infoDiv.textContent = `You have ${getHeroSoulsTotal().toFixed(1)} souls.`;

    const requiredKills = resources.prestigeCount + 1;
    const currentKills = getKillCount();

    const btn = document.getElementById("btn-prestige");
    btn.disabled = !canPrestige();
    btn.textContent = `Prestige (Kills: ${currentKills}/${requiredKills})`;

    btn.onclick = () => {
      if (canPrestige()) {
        doPrestige();
        startNewBattle();
        renderPrestigeView();
        renderBattleView();
        updateSidebarStats();
      }
    };
    updateAscendButton();
  }

  const resetBtn = document.getElementById("btn-reset");
  const resetModal = document.getElementById("reset-modal");
  const modalYes = document.getElementById("modal-yes");
  const modalNo = document.getElementById("modal-no");

  resetBtn.addEventListener("click", () => {
    resetModal.style.display = "flex";
  });

  modalNo.addEventListener("click", () => {
    resetModal.style.display = "none";
  });

  modalYes.addEventListener("click", () => {
    clearSave();
    location.reload();
  });

  const ascendBtn = document.getElementById("btn-ascend");
  const ascendMsg = document.getElementById("ascend-message");

  function canAscend() {
    return getHeroSoulsTotal() >= 1000000;
  }

  ascendBtn.addEventListener("click", () => {
    if (canAscend()) {
      ascendMsg.textContent = "🎉 Congratulations, you completed the game! 🎉";
      ascendMsg.style.display = "block";
      ascendBtn.disabled = true;
    } else {
      ascendMsg.textContent = "You need 1,000,000 hero souls to ascend!";
      ascendMsg.style.display = "block";
      setTimeout(() => {
        ascendMsg.style.display = "none";
      }, 2000);
    }
  });

  function updateAscendButton() {
    if (getHeroSoulsTotal() >= 1000000) {
      ascendBtn.style.display = "inline-block";
    } else {
      ascendBtn.style.display = "none";
      ascendMsg.style.display = "none";
    }
  }

  updateSidebarStats();
  if (!gameLoaded) {
    startNewBattle();
  }
  renderBattleView();
});

function updateSidebarStats() {
  const gold = getGold();
  const storedSouls = getHeroSoulsStored();
  document.getElementById("gold-label").textContent = `Gold:`;
  document.getElementById("gold-display").textContent = gold.toLocaleString();
  document.getElementById(
    "hero-souls-display"
  ).innerHTML = `after prestige:<br>${storedSouls.toFixed(1)} souls`;
}
