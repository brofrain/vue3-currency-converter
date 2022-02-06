import { computed, reactive, toRefs } from "vue";
import { defineStore } from "pinia";
import { currencyApi } from "@/api";
import type { CurrencyRates, CurrencyNames } from "@/types/api";

interface State {
  currencyRates: CurrencyRates;
  currencyNames: CurrencyNames;
}

const fetchCurrencyRates = async (state: State) => {
  state.currencyRates = await currencyApi.fetchRates();
};

const fetchCurrencyNames = async (state: State) => {
  state.currencyNames = await currencyApi.fetchNames();
};

export const useConverterStore = defineStore("converter", () => {
  const state = reactive<State>({
    currencyRates: {},
    currencyNames: {}
  });

  const isReady = computed(
    () =>
      !!Object.keys(state.currencyRates).length &&
      !!Object.keys(state.currencyNames).length
  );

  const currencies = computed(() =>
    Object.keys(state.currencyRates)
      .filter((currency) => currency in state.currencyNames)
      .sort()
  );

  const getRandomCurrency = () =>
    currencies.value[Math.floor(Math.random() * currencies.value.length)];

  const getCurrencyValueMultiplier = (
    baseCurrency: string,
    targetCurrency: string
  ) => {
    if (
      !state.currencyRates[baseCurrency] ||
      !state.currencyRates[targetCurrency]
    ) {
      return 0;
    }

    return (
      state.currencyRates[targetCurrency] / state.currencyRates[baseCurrency]
    );
  };

  const getCurrencyValue = (
    baseCurrency: string,
    targetCurrency: string,
    value: number
  ) => value * getCurrencyValueMultiplier(baseCurrency, targetCurrency);

  const getCurrencyValues = (
    baseCurrency: string,
    value: number
  ): Record<string, number> =>
    Object.assign(
      {},
      ...currencies.value.map(
        (currency: string) =>
          currency !== baseCurrency && {
            [currency]: getCurrencyValue(baseCurrency, currency, value)
          }
      )
    );

  fetchCurrencyRates(state);
  fetchCurrencyNames(state);

  return {
    ...toRefs(state),
    isReady,
    currencies,
    getRandomCurrency,
    getCurrencyValueMultiplier,
    getCurrencyValue,
    getCurrencyValues
  };
});
