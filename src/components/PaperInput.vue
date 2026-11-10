<script setup lang="ts">
import PaperField from './PaperField.vue'

const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    label?: string
    hint?: string
    error?: string
    note?: string
    required?: boolean
    id?: string
    name?: string
    type?: 'text' | 'search' | 'email' | 'tel' | 'password' | 'number' | 'url'
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    autocomplete?: string
    /** 数字类内容用等宽字，位对齐 */
    mono?: boolean
    /** 文本域行数；给出则渲染 textarea */
    rows?: number
    maxlength?: number
  }>(),
  { type: 'text', disabled: false, readonly: false, mono: false },
)
</script>

<template>
  <PaperField :label="label" :hint="hint" :error="error" :note="note" :required="required" :id="id">
    <template #default="{ id: fieldId, messageId, invalid, required: isRequired }">
      <textarea
        v-if="rows"
        :id="fieldId"
        v-model="model"
        class="paper-control"
        :class="{ 'paper-input--mono': mono }"
        :rows="rows"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="isRequired"
        :maxlength="maxlength"
        :aria-invalid="invalid || undefined"
        :aria-describedby="messageId"
      ></textarea>
      <input
        v-else
        :id="fieldId"
        v-model="model"
        class="paper-control"
        :class="{ 'paper-input--mono': mono }"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :required="isRequired"
        :maxlength="maxlength"
        :aria-invalid="invalid || undefined"
        :aria-describedby="messageId"
      />
    </template>
  </PaperField>
</template>

<style src="../styles/components/paper-input.css"></style>
