import { reactive, toRefs, watch } from "vue";
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import router from "@/router";

const COLOR_THEMES = ["dark", "light"] as const;

type ColorTheme = typeof COLOR_THEMES[number];

interface State {
  COLOR_THEMES: typeof COLOR_THEMES;
  colorTheme: ColorTheme;
  startingPath: string;
  keepChosenCurrencies: boolean;
  converterBaseCurrency: string | null;
  converterTargetCurrency: string | null;
  tableBaseCurrency: string | null;
}

const COOKIE_KEYS: Record<keyof Omit<State, "COLOR_THEMES">, string> = {
  colorTheme: "color-theme",
  startingPath: "starting-path",
  keepChosenCurrencies: "keep-chosen-currencies",
  converterBaseCurrency: "converter-base-currency",
  converterTargetCurrency: "converter-target-currency",
  tableBaseCurrency: "table-base-currency"
};

type CookieKey = typeof COOKIE_KEYS[keyof typeof COOKIE_KEYS];

const getCookie = (key: CookieKey) => Cookies.get(key);

const setCookie = (key: CookieKey, value: string) =>
  Cookies.set(key, value, { expires: 365 });

const unsetCookie = (key: CookieKey) => Cookies.remove(key);

const unsetCurrencyCookies = () => {
  unsetCookie(COOKIE_KEYS.converterBaseCurrency);
  unsetCookie(COOKIE_KEYS.converterBaseCurrency);
  unsetCookie(COOKIE_KEYS.converterTargetCurrency);
  unsetCookie(COOKIE_KEYS.tableBaseCurrency);
};

const isColorTheme = (value: string): value is ColorTheme =>
  COLOR_THEMES.includes(value as ColorTheme);

const getInitialColorTheme = (): ColorTheme =>
  window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? "dark"
    : "light";

const setAppElColorThemeClass = (colorTheme: ColorTheme) => {
  const appEl = document.querySelector("#app");

  if (!appEl) {
    return;
  }

  appEl.classList.remove(...appEl.classList);
  appEl.classList.add(`theme--${colorTheme}`);
};

const setState = async (state: State) => {
  const colorTheme = getCookie(COOKIE_KEYS.colorTheme);
  const startingPath = getCookie(COOKIE_KEYS.startingPath);
  const keepChosenCurrencies = getCookie(COOKIE_KEYS.keepChosenCurrencies);
  const converterBaseCurrency = getCookie(COOKIE_KEYS.converterBaseCurrency);
  const converterTargetCurrency = getCookie(
    COOKIE_KEYS.converterTargetCurrency
  );
  const tableBaseCurrency = getCookie(COOKIE_KEYS.tableBaseCurrency);

  if (colorTheme && isColorTheme(colorTheme)) {
    state.colorTheme = colorTheme;
  }

  if (keepChosenCurrencies === "true") {
    state.keepChosenCurrencies = true;

    if (converterBaseCurrency) {
      state.converterBaseCurrency = converterBaseCurrency;
    }

    if (converterTargetCurrency) {
      state.converterTargetCurrency = converterTargetCurrency;
    }

    if (tableBaseCurrency) {
      state.tableBaseCurrency = tableBaseCurrency;
    }
  } else {
    unsetCurrencyCookies();
  }

  await router.isReady();
  if (
    startingPath &&
    startingPath !== "/" &&
    router.currentRoute.value.path === "/"
  ) {
    const startingRoute = router
      .getRoutes()
      .find((item) => item.path === startingPath);

    if (startingRoute) {
      router.replace(startingRoute);
      state.startingPath = startingPath;
    } else {
      unsetCookie(COOKIE_KEYS.startingPath);
    }
  }
};

export const usePreferencesStore = defineStore("preferences", () => {
  const state = reactive<State>({
    COLOR_THEMES,
    colorTheme: getInitialColorTheme(),
    startingPath: "/",
    keepChosenCurrencies: false,
    converterBaseCurrency: null,
    converterTargetCurrency: null,
    tableBaseCurrency: null
  });

  const actions = {
    updateColorTheme(value: string) {
      if (isColorTheme(value)) {
        state.colorTheme = value;
        setCookie(COOKIE_KEYS.colorTheme, value);
      }
    },

    updateStartingPath(value: string) {
      state.startingPath = value;
      setCookie(COOKIE_KEYS.startingPath, value);
    },

    updateKeepChosenCurrencies(value: boolean) {
      state.keepChosenCurrencies = value;
      setCookie(COOKIE_KEYS.keepChosenCurrencies, String(value));

      if (!value) {
        unsetCurrencyCookies();
      }
    },

    updateConverterBaseCurrency(value: string) {
      state.converterBaseCurrency = value;
      setCookie(COOKIE_KEYS.converterBaseCurrency, value);
    },

    updateConverterTargetCurrency(value: string) {
      state.converterTargetCurrency = value;
      setCookie(COOKIE_KEYS.converterTargetCurrency, value);
    },

    updateTableBaseCurrency(value: string) {
      state.tableBaseCurrency = value;
      setCookie(COOKIE_KEYS.tableBaseCurrency, value);
    }
  };

  setState(state);

  setAppElColorThemeClass(state.colorTheme);
  watch(
    () => state.colorTheme,
    (colorTheme) => {
      setAppElColorThemeClass(colorTheme);
    }
  );

  return { ...toRefs(state), ...actions };
});
