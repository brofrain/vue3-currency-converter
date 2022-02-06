<template>
  <a class="base__link" :href="href" target="_blank">
    <slot />

    <div class="base__link__cover--fixed">
      <slot />
    </div>

    <div class="base__link__cover--local">
      <slot />
    </div>

    <div class="base__link__underline" />
  </a>
</template>

<script lang="ts" setup>
defineProps<{ href: string }>();
</script>

<style lang="scss" scoped>
.base__link {
  color: #0000;
  text-decoration: none;
  font-weight: 600;
  position: relative;

  .base__link__cover--fixed,
  .base__link__cover--local {
    @include base__cover;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .base__link__cover--fixed {
    @include base__gradient-text--fixed;

    @include base__transition(opacity);
    opacity: 1;
  }

  .base__link__cover--local {
    @include base__gradient-text--local;
  }

  .base__link__underline {
    @include base__gradient--local;
    position: absolute;
    height: 2px;
    bottom: -1px;
    left: 0;
    right: 0;
    pointer-events: none;
  }

  .base__link__cover--local,
  .base__link__underline {
    @include base__transition(opacity);
    opacity: 0;
  }

  &:hover {
    .base__link__cover--fixed {
      opacity: 0;
    }

    .base__link__cover--local,
    .base__link__underline {
      opacity: 1;
    }
  }
}
</style>
