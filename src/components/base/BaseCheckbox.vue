<template>
  <div class="base__checkbox">
    <div
      class="base__checkbox__button"
      :class="{
        'base__checkbox__button--active': modelValue,
        'base__checkbox__button--hover': hover
      }"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="toggleModelValue"
    >
      <div class="base__checkbox__button__cover">
        <div class="base__checkbox__button__cover__fill" />
      </div>

      <b-icon class="base__checkbox__button__icon" icon="xmark" />
    </div>

    <div
      v-if="label"
      class="base__checkbox__label"
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
  emit("update:model-value", !props.modelValue);
};
</script>

<style lang="scss" scoped>
.base__checkbox {
  display: flex;
  align-items: center;
  gap: 0.4rem;

  .base__checkbox__button {
    @include base__gradient--fixed;

    $size: 0.95rem;

    width: $size;
    height: $size;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;

    .base__checkbox__button__cover {
      @include base__cover(1px);
      border: 2px solid $base__color--secondary;

      .base__checkbox__button__cover__fill {
        @include base__cover(-1px);
        background: $base__color--secondary;

        @include base__transition(opacity);
        opacity: 1;
      }
    }

    .base__checkbox__button__icon {
      color: $base__color--secondary;
      font-size: $size * 0.9;

      @include base__transition(opacity);
      opacity: 0;
    }

    &.base__checkbox__button--hover {
      .base__checkbox__button__cover {
        .base__checkbox__button__cover__fill {
          opacity: 0.7;
        }
      }
    }

    &.base__checkbox__button--active {
      .base__checkbox__button__cover {
        .base__checkbox__button__cover__fill {
          opacity: 0;
        }
      }

      .base__checkbox__button__icon {
        opacity: 1;
      }
    }
  }

  .base__checkbox__label {
    color: $base__color--text;
    cursor: pointer;
  }
}
</style>
