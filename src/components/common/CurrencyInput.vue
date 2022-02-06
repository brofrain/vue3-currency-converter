<template>
  <div class="currency-input">
    <div class="currency-input__container">
      <b-input
        class="currency-input__input"
        type="number"
        :model-value="value"
        @update:model-value="(v: number) => updateValue(v)"
      />

      <div class="currency-input__collapser" @click="collapsed = !collapsed">
        <div class="currency-input__collapser__cover--fixed" />
        <div class="currency-input__collapser__cover--local" />
        <div class="currency-input__collapser__value">
          {{ currency }}
        </div>
      </div>
    </div>

    <b-transition>
      <b-input
        v-if="!collapsed"
        v-model="search"
        class="currency-input__search"
        type="search"
        focus
        @click.stop
      />
    </b-transition>

    <b-transition>
      <div
        v-if="!collapsed"
        class="currency-input__dropdown__wrapper"
        @click.stop
      >
        <div class="currency-input__dropdown">
          <b-scroll v-model="dropdownScroll">
            <div
              class="currency-input__dropdown__container"
              @mouseleave="unsetHighlightedCurrency"
            >
              <div
                v-for="code in currencies"
                :key="code"
                :ref="(el) => pushDropdownItemEl(el as HTMLDivElement, code)"
                class="currency-input__dropdown__item"
                :class="{
                  'currency-input__dropdown__item--active':
                    isActiveCurrency(code),
                  'currency-input__dropdown__item--highlight':
                    isHighlightedCurrency(code)
                }"
                @mousemove="updateHighlightedCurrency(code)"
                @click="updateCurrency(code)"
              >
                <div class="currency-input__dropdown__item__cover" />

                <div class="currency-input__dropdown__item__name">
                  {{ currencyNames[code] }}
                </div>

                <div class="currency-input__dropdown__item__code">
                  {{ code }}
                </div>
              </div>
            </div>
          </b-scroll>
        </div>
      </div>
    </b-transition>
  </div>
</template>

<script lang="ts" setup>
import type { SetupContext } from "vue";
import { useCurrencyInputDropdown } from "@/composables";

const props = defineProps<{ value: number; currency: string }>();

const emit = defineEmits<{
  (e: "update:value", value: number): void;
  (e: "update:currency", currency: string): void;
}>();

const {
  collapsed,
  collapse,
  pushDropdownItemEl,
  dropdownScroll,
  search,
  currencyNames,
  currencies,
  isActiveCurrency,
  isHighlightedCurrency,
  updateHighlightedCurrency,
  unsetHighlightedCurrency
} = useCurrencyInputDropdown(props, { emit } as SetupContext);

const updateValue = (value: number) => {
  emit("update:value", value);
};

const updateCurrency = (currency: string) => {
  emit("update:currency", currency);
  collapse();
};
</script>

<style lang="scss" scoped>
$input__width: 10rem;
$input__height: 2.2rem;
$input__border__width: 2px;
$collapser__width: 3.6rem;
$collapser__font-weight: 600;
$round-radius: 8px;

@mixin cover {
  @include base__cover;
  pointer-events: none;
}

.currency-input {
  width: $input__width + $collapser__width;
  height: $input__height;
  border-radius: $round-radius;
  user-select: none;
  position: relative;
  line-height: 1;

  .currency-input__container {
    display: flex;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    overflow: hidden;
    position: relative;

    .currency-input__input {
      flex: 1 0 0;
      border-radius: $round-radius 0 0 $round-radius;
    }

    .currency-input__collapser {
      flex: 0 0 $collapser__width;
      border-radius: 0 $round-radius $round-radius 0;
      cursor: pointer;
      position: relative;

      .currency-input__collapser__cover--fixed,
      .currency-input__collapser__cover--local,
      .currency-input__collapser__value {
        @include cover;
      }

      .currency-input__collapser__cover--fixed,
      .currency-input__collapser__cover--local {
        @include base__transition--gradient(opacity);
      }

      .currency-input__collapser__cover--fixed {
        @include base__gradient--fixed;
        opacity: 1;
      }

      .currency-input__collapser__cover--local {
        @include base__gradient--local;
        opacity: 0;
      }

      .currency-input__collapser__value {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.98rem;
        text-transform: uppercase;
        color: $base__color--primary;
        font-weight: $collapser__font-weight;
      }

      &:hover {
        .currency-input__collapser__cover--fixed {
          transition: opacity $base__animation-duration--gradient
            $base__animation-duration--gradient;
          opacity: 0;
        }

        .currency-input__collapser__cover--local {
          opacity: 1;
        }
      }
    }
  }

  .currency-input__search {
    @include base__cover;
  }

  .currency-input__dropdown__wrapper {
    @include base__gradient--fixed;
    position: absolute;
    top: calc(100% + 1px);
    left: 0;
    right: 0;
    border-radius: inherit;
    padding: 1px;
    z-index: 2;
    box-shadow: 0 0 3px 0 $base__color--shadow;

    .currency-input__dropdown {
      height: 13rem;
      border-radius: inherit;
      background: $base__color--secondary;

      .currency-input__dropdown__container {
        border-radius: inherit;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;

        .currency-input__dropdown__item {
          flex: 0 0 $input__height * 0.8;
          display: flex;
          gap: 2px;
          cursor: pointer;
          position: relative;
          color: $base__color--text;
          text-align: center;
          font-weight: $collapser__font-weight;

          .currency-input__dropdown__item__cover {
            @include cover;
            @include base__gradient--fixed;

            @include base__transition--gradient(opacity);
            opacity: 0;
          }

          .currency-input__dropdown__item__name,
          .currency-input__dropdown__item__code {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .currency-input__dropdown__item__name {
            flex: 1 0 0;
            font-size: 0.65rem;
            padding: 0 5px;
          }

          .currency-input__dropdown__item__code {
            flex: 0 0 $collapser__width;
            font-size: 0.75rem;
            text-transform: uppercase;
          }

          &:nth-child(2n) {
            background: $base__color--primary;
          }

          &:nth-child(2n - 1) {
            background: $base__color--secondary;
          }

          &.currency-input__dropdown__item--active {
            cursor: auto;

            .currency-input__dropdown__item__name,
            .currency-input__dropdown__item__code {
              @include base__gradient-text--fixed;
            }
          }

          &:not(.currency-input__dropdown__item--active) {
            &.currency-input__dropdown__item--highlight {
              color: $base__color--primary;
              text-shadow: 0 0 1px $base__color--primary;

              .currency-input__dropdown__item__cover {
                opacity: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>
