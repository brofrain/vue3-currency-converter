<template>
  <div class="base__radio">
    <div
      class="base__radio__button"
      :class="{
        'base__radio__button--active': modelValue,
        'base__radio__button--hover': hover
      }"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="toggleModelValue"
    >
      <div class="base__radio__button__cover">
        <div class="base__radio__button__cover__fill" />
      </div>
    </div>

    <div
      v-if="label"
      class="base__radio__label"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="toggleModelValue"
    >
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const props = defineProps<{ modelValue: boolean; label?: string }>();
const emit =
  defineEmits<{ (e: "update:model-value", modelValue: boolean): void }>();

const hover = ref(false);

const toggleModelValue = () => {
  if (!props.modelValue) {
    emit("update:model-value", true);
  }
};
</script>

<style lang="scss" scoped>
.base__radio {
  display: flex;
  align-items: center;
  gap: 0.4rem;

  .base__radio__button {
    @include base__gradient--fixed;

    $size: 0.9rem;

    width: $size;
    height: $size;
    border-radius: 9999px;
    position: relative;
    cursor: pointer;

    .base__radio__button__cover {
      @include base__cover(1px);
      border: 2px solid $base__color--secondary;

      .base__radio__button__cover__fill {
        @include base__cover(-1px);
        background: $base__color--secondary;

        @include base__transition(opacity);
        opacity: 1;
      }
    }

    &.base__radio__button--hover {
      .base__radio__button__cover {
        .base__radio__button__cover__fill {
          opacity: 0.7;
        }
      }
    }

    &.base__radio__button--active {
      .base__radio__button__cover {
        .base__radio__button__cover__fill {
          opacity: 0;
        }
      }
    }
  }

  .base__radio__label {
    color: $base__color--text;
    cursor: pointer;
  }
}
</style>
