<template>
  <div class="base__content-cover" />
</template>

<style lang="scss" scoped>
.base__content-cover {
  @include base__cover(0, 15px);
  pointer-events: none;
  background: $base__color--primary;
  opacity: 0.9;
  box-shadow: 0 0 5px 2px $base__color--shadow;
}
</style>
