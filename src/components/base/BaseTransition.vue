<template>
  <transition
    class="base__transition"
    enter-active-class="base__transition--enter"
    leave-active-class="base__transition--leave"
    mode="out-in"
    appear
  >
    <slot />
  </transition>
</template>

<style lang="scss" scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.base__transition {
  animation-duration: $base__animation-duration;

  &.base__transition--enter {
    animation-name: fade-in;
  }

  &.base__transition--leave {
    animation-name: fade-out;
  }
}
</style>
