<template>
  <div
    class="base__outline-icon-button"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div class="base__outline-icon-button__primary-cover" />
    <div class="base__outline-icon-button__gradient-cover" />

    <b-icon
      class="base__outline-icon-button__icon"
      :type="type"
      :icon="icon"
      :gradient="!hover"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps<{ icon: string; type?: string }>();

const hover = ref(false);
</script>

<style lang="scss" scoped>
.base__outline-icon-button {
  @include base__button-square-size;
  @include base__gradient--fixed;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 9999px;
  cursor: pointer;
  user-select: none;

  .base__outline-icon-button__primary-cover {
    @include base__cover(2px);
    pointer-events: none;
    background: $base__color--primary;
  }

  .base__outline-icon-button__gradient-cover {
    @include base__cover;
    @include base__gradient--local;
    pointer-events: none;

    @include base__transition--gradient(opacity);
    opacity: 0;
  }

  .base__outline-icon-button__icon {
    font-size: calc(var(--base__button-size, 36px) * 0.6);
    color: $base__color--primary;
    position: relative;
  }

  &:hover {
    .base__outline-icon-button__gradient-cover {
      opacity: 1;
    }
  }
}
</style>
