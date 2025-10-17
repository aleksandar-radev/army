<template>
  <div class="backdrop" @click.self="close">
    <div class="modal">
      <header class="modal__header">
        <h3>Reset Progress</h3>
        <p>Are you sure you want to wipe your save? This action cannot be undone.</p>
      </header>
      <div class="modal__actions">
        <button type="button" class="cancel" @click="close">Cancel</button>
        <button type="button" class="confirm" @click="confirm">Reset Game</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useProgressionStore } from '@/stores/progressionStore.js';
import { useUiStore } from '@/stores/uiStore.js';

const progression = useProgressionStore();
const ui = useUiStore();

const close = () => {
  ui.closeResetModal();
};

const confirm = () => {
  progression.resetGame();
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.75);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 24px;
}

.modal {
  background: rgba(15, 23, 42, 0.95);
  border-radius: 20px;
  padding: 28px;
  width: min(420px, 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.55);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal__header h3 {
  margin: 0;
  font-size: 1.4rem;
}

.modal__header p {
  margin: 8px 0 0;
  color: rgba(148, 163, 184, 0.85);
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel,
.confirm {
  padding: 12px 18px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.cancel {
  background: rgba(148, 163, 184, 0.2);
  color: rgba(226, 232, 240, 0.9);
}

.confirm {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(190, 24, 93, 0.9));
  color: #fff;
  box-shadow: 0 14px 34px rgba(239, 68, 68, 0.35);
}

.confirm:hover {
  transform: translateY(-1px);
}
</style>
