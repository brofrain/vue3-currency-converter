<template>
  <div id="converter">
    <div class="converter__container">
      <b-content-cover />

      <div class="converter__container__content">
        <div>
          <div class="converter__container__text">Base currency:</div>

          <CurrencyInput
            v-model:currency="baseCurrency"
            :value="baseValue"
            @update:value="updateBaseValue"
          />
        </div>

        <b-outline-icon-btn
          icon="arrow-right-arrow-left"
          @click="swapCurrencies"
        />

        <div>
          <div class="converter__container__text">Target currency:</div>

          <CurrencyInput
            v-model:currency="targetCurrency"
            :value="targetValue"
            @update:value="updateTargetValue"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CurrencyInput } from "@/components/common";

import { computed, ref, watch } from "vue";
import { useConverterStore } from "@/stores/converter";
import { usePreferencesStore } from "@/stores/preferences";

const $converterStore = useConverterStore();
const $preferencesStore = usePreferencesStore();

const keepChosenCurrencies = computed(
  () => $preferencesStore.keepChosenCurrencies
);

const baseCurrency = ref(
  (keepChosenCurrencies.value && $preferencesStore.converterBaseCurrency) ||
    $converterStore.getRandomCurrency()
);
const targetCurrency = ref(
  (keepChosenCurrencies.value && $preferencesStore.converterTargetCurrency) ||
    $converterStore.getRandomCurrency()
);

const swapCurrencies = () => {
  [baseCurrency.value, targetCurrency.value] = [
    targetCurrency.value,
    baseCurrency.value
  ];
};

const baseValue = ref(1);
const targetValue = ref(0);

const getCurrencyValue = (
  base: string,
  target: string,
  value: number
): number => $converterStore.getCurrencyValue(base, target, value);

const roundValue = (value: number) => Math.round(value * 100) / 100;

const setBaseValue = () => {
  baseValue.value = roundValue(
    getCurrencyValue(
      targetCurrency.value,
      baseCurrency.value,
      targetValue.value
    )
  );
};
const setTargetValue = () => {
  targetValue.value = roundValue(
    getCurrencyValue(baseCurrency.value, targetCurrency.value, baseValue.value)
  );
};

const updateBaseValue = (value: number) => {
  baseValue.value = value;
  setTargetValue();
};
const updateTargetValue = (value: number) => {
  targetValue.value = value;
  setBaseValue();
};

watch([baseCurrency, targetCurrency], setTargetValue);

const updatePreferredBaseCurrency = () => {
  if (keepChosenCurrencies.value) {
    $preferencesStore.updateConverterBaseCurrency(baseCurrency.value);
  }
};

const updatePreferredTargetCurrency = () => {
  if (keepChosenCurrencies.value) {
    $preferencesStore.updateConverterTargetCurrency(targetCurrency.value);
  }
};

const updatePreferredCurrencies = () => {
  if (keepChosenCurrencies.value) {
    updatePreferredBaseCurrency();
    updatePreferredTargetCurrency();
  }
};

watch(baseCurrency, updatePreferredBaseCurrency);
watch(targetCurrency, updatePreferredTargetCurrency);
watch(keepChosenCurrencies, updatePreferredCurrencies);

setTargetValue();
updatePreferredCurrencies();
</script>

<style lang="scss" scoped>
#converter {
  display: flex;
  justify-content: center;

  .converter__container {
    position: relative;
    max-width: 100%;

    .converter__container__content {
      position: relative;

      max-width: 100%;
      padding: 35px 25px;
      display: flex;
      flex-direction: column;
      align-items: center;
      column-gap: 1.5rem;
      row-gap: 1rem;

      .converter__container__text {
        color: $base__color--text;
        line-height: 1;
        text-align: center;
        user-select: none;
        padding-bottom: 0.65rem;
      }

      @media (min-width: 700px) {
        flex-direction: row;
        align-items: flex-end;
      }
    }
  }
}
</style>
