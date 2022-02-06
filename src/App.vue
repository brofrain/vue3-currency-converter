<template>
  <TheNavbar />

  <TheContainer />
</template>

<script lang="ts" setup>
import { TheNavbar, TheContainer } from "@/components/sections";
</script>

<style lang="scss">
@import "./styles/index.scss";

#app {
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
</style>
