import { EnemyConfig } from "./config.js";
import { getArtifactEffectBonus } from "./artifact.js";

export class EnemyHero {
  constructor(level) {
    this.level = level;
    this.maxHp = Math.floor(
      EnemyConfig.baseHp * Math.pow(EnemyConfig.hpGrowth, level - 1)
    );
    this.currentHp = this.maxHp;
    this.dmg = Math.floor(
      EnemyConfig.baseDmg * Math.pow(EnemyConfig.dmgGrowth, level - 1)
    );
    this.baseGoldReward = Math.floor(5 * Math.pow(level, 1.05));
  }

  isAlive() {
    return this.currentHp > 0;
  }

  takeDamage(amount) {
    this.currentHp = Math.max(0, this.currentHp - amount);
  }

  getCurrentHp() {
    return this.currentHp;
  }

  getMaxHp() {
    return this.maxHp;
  }

  getDmg() {
    return this.dmg;
  }

  getLevel() {
    return this.level;
  }

  getGoldReward() {
    const goldBonus = getArtifactEffectBonus("enemyGold%");
    return Math.floor(this.baseGoldReward * (1 + goldBonus));
  }
}
