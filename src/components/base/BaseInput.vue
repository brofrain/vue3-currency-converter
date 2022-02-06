<template>
  <div ref="wrapperEl" class="base__input__wrapper">
    <input
      ref="inputEl"
      class="base__input"
      :class="`base__input--${type}`"
      :type="type === 'number' ? 'number' : 'text'"
      spellcheck="false"
      :value="modelValue"
      @input="updateModelValue"
    />

    <div class="base__input__cover" />

    <template v-if="type === 'search'">
      <b-icon class="base__input__search-icon--fixed" icon="magnifying-glass" />
      <b-icon class="base__input__search-icon--local" icon="magnifying-glass" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const props = defineProps<{
  modelValue: number | string;
  type: "number" | "text" | "search";
  focus?: boolean;
}>();
const emit = defineEmits<{
  (e: "update:model-value", modelValue: number | string): void;
}>();

const updateModelValue = (e: Event) => {
  const value = (e as Event & { target: HTMLInputElement }).target.value;
  emit("update:model-value", props.type === "number" ? Number(value) : value);
};

const wrapperEl = ref<HTMLDivElement>();
const inputEl = ref<HTMLInputElement>();

const setInputBorderRadius = () => {
  if (!wrapperEl.value || !inputEl.value) {
    return;
  }

  inputEl.value.style.borderRadius = getComputedStyle(wrapperEl.value)
    .borderRadius.split(" ")
    .map((value) => (value !== "0px" ? `calc(${value} * 0.7)` : value))
    .join(" ");
};

onMounted(() => {
  setInputBorderRadius();

  if (props.focus) {
    inputEl.value?.focus();
  }
});
</script>

<style lang="scss" scoped>
$search-icon__x-padding: 0.5rem;
$search-icon__size: 1.3rem;

.base__input__wrapper {
  @include base__gradient--fixed;
  border-radius: 8px;
  padding: 2px;
  position: relative;

  .base__input__cover,
  .base__input__search-icon--fixed,
  .base__input__search-icon--local {
    @include base__cover;
    pointer-events: none;

    @include base__transition--gradient(opacity);
  }

  .base__input__cover {
    @include base__gradient--local;

    opacity: 0;
  }

  .base__input__search-icon--fixed,
  .base__input__search-icon--local {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 $search-icon__x-padding;
    font-size: $search-icon__size;
  }

  .base__input__search-icon--fixed {
    @include base__gradient-text--fixed;
    opacity: 1;
  }

  .base__input__search-icon--local {
    @include base__gradient-text--local;
    opacity: 0;
  }

  .base__input {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    box-shadow: none;
    outline: none;
    border: none;
    position: relative;
    background: $base__color--secondary;
    color: $base__color--text;
    font-size: 1rem;
    line-height: 1;
    z-index: 1;

    &:focus {
      outline: none;

      ~ .base__input__cover {
        opacity: 1;
      }
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;

    &.base__input--number,
    &.base__input--text {
      text-align: center;
    }

    &.base__input--search {
      text-align: left;
      padding: 0 $search-icon__size + $search-icon__x-padding * 1.5 0
        $search-icon__x-padding;

      &:focus {
        ~ .base__input__search-icon--fixed {
          opacity: 0;
        }

        ~ .base__input__search-icon--local {
          opacity: 1;
        }
      }
    }
  }
}
</style>
