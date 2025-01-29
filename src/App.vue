<template>
  <div id="app">
    <KnightList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import KnightList from './components/KnightList.vue';

export default defineComponent({
  name: 'App',
  components: {
    KnightList,
  },
});
</script>
