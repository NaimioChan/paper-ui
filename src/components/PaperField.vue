<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 字段标签，同时也是控件的可访问名 */
    label?: string
    /** 常态提示，与 error 同时存在时只显示 error */
    hint?: string
    /** 错误文案，非空即进入错误态 */
    error?: string
    /** 右上角的可选说明，例如字数限制 */
    note?: string
    /** 控件必填 */
    required?: boolean
    /** 控件 id；不传则自动生成，并通过插槽回传给控件 */
    id?: string
  }>(),
  { required: false },
)

const autoId = useId()
const fieldId = computed(() => props.id ?? `paper-field-${autoId}`)
const messageId = computed(() => `${fieldId.value}-message`)
const hasError = computed(() => Boolean(props.error))
const message = computed(() => props.error || props.hint || '')
</script>

<template>
  <div class="paper-field" :class="{ 'paper-field--invalid': hasError }">
    <div v-if="label || note || required" class="paper-field__head">
      <label v-if="label" class="paper-field__label" :for="fieldId">
        {{ label }}
        <span v-if="required" class="paper-field__required" aria-hidden="true">*</span>
        <span v-if="required" class="paper-visually-hidden">必填</span>
      </label>
      <span v-if="note" class="paper-field__note">{{ note }}</span>
    </div>
    <slot :id="fieldId" :message-id="messageId" :invalid="hasError" :required="required" />
    <p v-if="message" :id="messageId" class="paper-field__message" :class="{ 'paper-field__message--error': hasError }">
      {{ message }}
    </p>
  </div>
</template>

<style src="../styles/components/paper-field.css"></style>
