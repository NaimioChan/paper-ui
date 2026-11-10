<script setup lang="ts">
import { computed } from 'vue'
import PaperField from './PaperField.vue'

export interface PaperSelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const model = defineModel<string | number | null>({ default: null })

const props = withDefaults(
  defineProps<{
    /** 选项数组；也可改用默认插槽塞原生 option */
    options?: PaperSelectOption[]
    /** 空选项文案，给 placeholder 效果；不传则不显示空项 */
    placeholder?: string
    label?: string
    hint?: string
    error?: string
    note?: string
    required?: boolean
    id?: string
    name?: string
    disabled?: boolean
  }>(),
  { options: () => [], disabled: false },
)

const isPlaceholder = computed(() => props.placeholder !== undefined && model.value === null)
</script>

<template>
  <PaperField :label="label" :hint="hint" :error="error" :note="note" :required="required" :id="id">
    <template #default="{ id: fieldId, messageId, invalid, required: isRequired }">
      <div class="paper-select" :class="{ 'paper-select--placeholder': isPlaceholder }">
        <select
          :id="fieldId"
          v-model="model"
          class="paper-control paper-select__native"
          :name="name"
          :disabled="disabled"
          :required="isRequired"
          :aria-invalid="invalid || undefined"
          :aria-describedby="messageId"
        >
          <option v-if="placeholder !== undefined" :value="null" disabled>{{ placeholder }}</option>
          <option
            v-for="option in options"
            :key="String(option.value)"
            :value="option.value"
            :disabled="option.disabled"
          >
            {{ option.label }}
          </option>
          <slot />
        </select>
        <span class="paper-select__mark" aria-hidden="true"></span>
      </div>
    </template>
  </PaperField>
</template>

<style src="../styles/components/paper-select.css"></style>
