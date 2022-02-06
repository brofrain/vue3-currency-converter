<template>
  <div id="view">
    <router-view v-if="isConverterReady" v-slot="{ Component }">
      <b-transition>
        <component :is="Component" />
      </b-transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useConverterStore } from "@/stores/converter";

const $converterStore = useConverterStore();

const isConverterReady = computed(() => $converterStore.isReady);
</script>

<style lang="scss" scoped>
#view {
  flex: 1 0 auto;
  position: relative;
  padding: 1rem 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
}
</style>
