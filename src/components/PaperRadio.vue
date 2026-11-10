<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<string | number | boolean | null>({ default: null })

withDefaults(
  defineProps<{
    label?: string
    hint?: string
    disabled?: boolean
    id?: string
    name: string
    /** 本项在该组中的取值 */
    value: string | number | boolean
  }>(),
  { disabled: false },
)

const autoId = useId()
</script>

<template>
  <label class="paper-choice paper-choice--radio" :class="{ 'paper-choice--disabled': disabled }">
    <input
      :id="id ?? `paper-radio-${autoId}`"
      v-model="model"
      class="paper-choice__input"
      type="radio"
      :name="name"
      :value="value"
      :disabled="disabled"
    />
    <span class="paper-choice__box" aria-hidden="true"></span>
    <span v-if="label || hint" class="paper-choice__text">
      <span class="paper-choice__label">{{ label }}</span>
      <span v-if="hint" class="paper-choice__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style src="../styles/components/paper-choice.css"></style>
