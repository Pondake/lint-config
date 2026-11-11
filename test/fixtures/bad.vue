<script>
export default {
  name: 'BadThing',
  data() {
    return { count: 0 }
  },
}
</script>

<template>
  <UButton :label="String(count)" />
</template>
