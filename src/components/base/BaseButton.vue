<template>
  <div class="base__button">
    <div class="base__button-cover" />
    <div class="base__button-slot">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base__button {
  @include base__button-height;
  @include base__gradient--fixed;

  width: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 7px;
  cursor: pointer;
  user-select: none;
  color: $base__color--primary;
  font-size: 1rem;
  line-height: 1.3;
  font-weight: 600;

  .base__button-cover {
    @include base__cover;
    @include base__gradient--local;
    pointer-events: none;

    @include base__transition--gradient(opacity);
    opacity: 0;
  }

  .base__button-slot {
    position: relative;
  }

  &:hover {
    .base__button-cover {
      opacity: 1;
    }
  }
}
</style>
