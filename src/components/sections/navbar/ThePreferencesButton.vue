<template>
  <div
    class="preferences-button"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="preferences-button__cover" />
    <b-icon class="preferences-button__icon" icon="gear" :gradient="!hover" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const hover = ref(false);
</script>

<style lang="scss" scoped>
.preferences-button {
  @include base__button-square-size(0.8);

  $round-radius: 7px;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  border-radius: $round-radius;
  position: relative;
  cursor: pointer;
  user-select: none;
  background: $base__color--primary;

  .preferences-button__cover {
    @include base__cover(2px, $round-radius * 0.7);
    @include base__gradient--fixed;

    @include base__transition--gradient(opacity);
    opacity: 0;
  }

  .preferences-button__icon {
    font-size: calc(var(--base__button-size, 36px) * 0.55);
    color: $base__color--primary;
    position: relative;
  }

  &:hover {
    .preferences-button__cover {
      opacity: 1;
    }
  }
}
</style>
