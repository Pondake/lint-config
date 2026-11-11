<template>
  <div class="wrapper">
    <u-button
      :label="label"
      @click="emit('select')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
const emit = defineEmits<{ select: [] }>()
</script>
