<template>
  <div ref="iconEl" class="base__icon" :class="faClass">
    <b-transition>
      <div
        v-show="gradient"
        class="base__icon__gradient-icon"
        :class="faClass"
      />
    </b-transition>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    icon: string;
    type?: string;
    gradient?: boolean;
  }>(),
  { type: "solid" }
);

const faClass = computed(() => [`fa-${props.type}`, `fa-${props.icon}`]);
</script>

<style lang="scss" scoped>
.base__icon {
  line-height: 1;
  user-select: none;
  position: relative;

  // icons seem to position themselves incorrectly on smaller devices
  padding-top: 1px;
  @media (min-width: 1500px) {
    padding-top: 0;
  }

  .base__icon__gradient-icon {
    @include base__gradient-text--fixed;
    padding-top: inherit;
    position: absolute;
    inset: 0;
  }
}
</style>
