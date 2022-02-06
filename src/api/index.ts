import axios from "axios";
import type { AxiosResponse } from "axios";

import type { CurrencyNames, CurrencyRates } from "@/types/api";

const get = axios.create({
  method: "get",
  timeout: 5000,
  responseType: "json"
});

export const currencyApi = {
  fetchRates: async () => {
    const baseCurrency = import.meta.env.VITE_BASE_CURRENCY;
    const response: AxiosResponse<Record<typeof baseCurrency, CurrencyRates>> =
      await get(import.meta.env.VITE_CURRENCY_RATES_API_URL);
    return response.data[baseCurrency];
  },

  fetchNames: async () => {
    const response: AxiosResponse<CurrencyNames> = await get(
      import.meta.env.VITE_CURRENCY_NAMES_API_URL
    );
    return response.data;
  }
};
