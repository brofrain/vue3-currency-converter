<template>
  <div id="table">
    <div class="table__base-currency-container">
      <b-content-cover />

      <div class="table__base-currency-container__content">
        <div>Base currency:</div>

        <CurrencyInput
          v-model:currency="baseCurrency"
          v-model:value="baseValue"
        />
      </div>
    </div>

    <b-table
      :cols="[
        { name: 'Currency', textAlign: 'center' },
        { name: 'Name', textAlign: 'start', isInferior: true },
        { name: 'Value', textAlign: 'end' }
      ]"
      :rows="tableRows"
    />
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

const currencyNames = computed(() => $converterStore.currencyNames);

const baseCurrency = ref(
  (keepChosenCurrencies.value && $preferencesStore.tableBaseCurrency) ||
    $converterStore.getRandomCurrency()
);

const baseValue = ref(1);

const targetValues = computed(() =>
  $converterStore.getCurrencyValues(baseCurrency.value, baseValue.value)
);

const formatCurrencyValue = (value: number) => {
  const [integer, decimal] = value.toFixed(4).split(".");
  return [integer.replace(/\B(?=(\d{3})+(?!\d))/g, " "), decimal].join(".");
};

const tableRows = computed(() =>
  Object.entries(targetValues.value).map(([currency, value]) => [
    currency.toUpperCase(),
    currencyNames.value[currency],
    formatCurrencyValue(value)
  ])
);

const updatePreferredBaseCurrency = () => {
  if (keepChosenCurrencies.value) {
    $preferencesStore.updateTableBaseCurrency(baseCurrency.value);
  }
};

const updatePreferredCurrencies = () => {
  if (keepChosenCurrencies.value) {
    updatePreferredBaseCurrency();
  }
};

watch(baseCurrency, updatePreferredBaseCurrency);
watch(keepChosenCurrencies, updatePreferredCurrencies);

updatePreferredCurrencies();
</script>

<style lang="scss" scoped>
#table {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 1.5rem;

  .table__base-currency-container {
    position: relative;
    max-width: 100%;

    .table__base-currency-container__content {
      position: relative;

      max-width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      column-gap: 1.5rem;
      row-gap: 0.5rem;
      padding: 1.5rem;

      color: $base__color--text;
      text-align: center;
      user-select: none;
    }
  }
}
</style>
