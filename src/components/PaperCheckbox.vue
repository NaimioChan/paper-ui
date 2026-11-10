<script setup lang="ts">
import { useId } from 'vue'

const model = defineModel<boolean>({ default: false })

withDefaults(
  defineProps<{
    label?: string
    hint?: string
    disabled?: boolean
    id?: string
    name?: string
    value?: string
    /** 组内不确定态，只用于全选这类场景 */
    indeterminate?: boolean
  }>(),
  { disabled: false, indeterminate: false },
)

const autoId = useId()
</script>

<template>
  <label class="paper-choice" :class="{ 'paper-choice--disabled': disabled }">
    <input
      :id="id ?? `paper-checkbox-${autoId}`"
      v-model="model"
      class="paper-choice__input"
      type="checkbox"
      :name="name"
      :value="value"
      :disabled="disabled"
      :indeterminate="indeterminate"
    />
    <span class="paper-choice__box" aria-hidden="true"></span>
    <span v-if="label || hint" class="paper-choice__text">
      <span class="paper-choice__label">{{ label }}</span>
      <span v-if="hint" class="paper-choice__hint">{{ hint }}</span>
    </span>
  </label>
</template>

<style src="../styles/components/paper-choice.css"></style>
