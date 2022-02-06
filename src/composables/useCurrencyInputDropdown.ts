import { ref, computed, watch, onBeforeUnmount, type SetupContext } from "vue";
import { forceNextTick, match } from "@/helpers/utils";
import { useConverterStore } from "@/stores/converter";

export default (props: { currency: string }, { emit }: SetupContext) => {
  const $converterStore = useConverterStore();

  const collapsed = ref(true);

  const collapse = () => {
    collapsed.value = true;
  };

  const dropdownItemElObj: Record<string, HTMLDivElement> = {};

  const pushDropdownItemEl = (el: HTMLDivElement, currency: string) => {
    dropdownItemElObj[currency] = el;
  };

  const dropdownScroll = ref(0);

  const search = ref("");

  const currencyNames = computed(() => $converterStore.currencyNames);

  const currencies = computed(() => {
    if (!search.value) {
      return $converterStore.currencies;
    }

    const lowercaseSearch = search.value.toLowerCase();
    const matchIndexes: Record<string, number> = {};
    const matchSearchables: Record<string, string> = {};
    const matchingCurrencies = $converterStore.currencies.filter((code) => {
      const searchable = `${code}.${currencyNames.value[code]
        .replace(/\s+/g, "")
        .toLowerCase()}`;

      const matchIndex = searchable.search(lowercaseSearch);

      if (matchIndex === -1) {
        return false;
      }

      matchIndexes[code] = matchIndex;
      matchSearchables[code] = searchable;

      return true;
    });

    return matchingCurrencies.sort((a, b) => {
      if (matchIndexes[a] !== matchIndexes[b]) {
        return matchIndexes[a] > matchIndexes[b] ? 1 : -1;
      }
      return matchSearchables[a] > matchSearchables[b] ? 1 : -1;
    });
  });

  const highlightedCurrency = ref<string | null>(null);

  const isActiveCurrency = (currency: string) => currency === props.currency;

  const isHighlightedCurrency = (currency: string) =>
    currency === highlightedCurrency.value;

  const updateHighlightedCurrency = (currency: string) => {
    if (currency !== highlightedCurrency.value) {
      highlightedCurrency.value = currency;
    }
  };

  const unsetHighlightedCurrency = () => {
    if (highlightedCurrency.value) {
      highlightedCurrency.value = null;
    }
  };

  const scrollToDropdownItem = (currency: string) => {
    const el = dropdownItemElObj[currency];

    if (!el) {
      dropdownScroll.value = 0;
      return;
    }

    dropdownScroll.value = el.offsetTop + el.offsetHeight / 2;
  };

  const scrollToActiveDropdownItem = () => {
    scrollToDropdownItem(props.currency);
  };

  const scrollToHighlightedDropdownItem = () => {
    if (highlightedCurrency.value) {
      scrollToDropdownItem(highlightedCurrency.value);
    }
  };

  const updateHighlightedCurrencyWithFirst = () => {
    highlightedCurrency.value = currencies.value[0];

    if (!search.value && dropdownScroll.value) {
      dropdownScroll.value = 0;
    }
  };

  const highlightedCurrencyIndex = computed(() =>
    highlightedCurrency.value
      ? currencies.value.indexOf(highlightedCurrency.value)
      : -1
  );

  const getNewHighlightedCurrencyRelativeIndex = () =>
    highlightedCurrency.value
      ? highlightedCurrencyIndex.value
      : currencies.value.indexOf(props.currency);

  const updateHighlightedCurrencyWithPrevious = () => {
    const relativeIndex = getNewHighlightedCurrencyRelativeIndex();

    if (relativeIndex > 0) {
      highlightedCurrency.value = currencies.value[relativeIndex - 1];
    } else if (!highlightedCurrency.value) {
      updateHighlightedCurrencyWithFirst();
    }

    scrollToHighlightedDropdownItem();
  };

  const updateHighlightedCurrencyWithNext = () => {
    const relativeIndex = getNewHighlightedCurrencyRelativeIndex();

    if (relativeIndex !== -1 && relativeIndex + 1 < currencies.value.length) {
      highlightedCurrency.value = currencies.value[relativeIndex + 1];
    } else if (!highlightedCurrency.value) {
      updateHighlightedCurrencyWithFirst();
    }

    scrollToHighlightedDropdownItem();
  };

  const updateCurrencyWithHighlighted = () => {
    if (!highlightedCurrency.value) {
      return;
    }

    emit("update:currency", highlightedCurrency.value);
    collapse();
  };

  let keydownLock = false;
  const handleDocumentKeydown = (e: KeyboardEvent) => {
    if (keydownLock) {
      return;
    }

    keydownLock = true;
    setTimeout(() => {
      keydownLock = false;
    }, 100);

    const fn = match(e.key)({
      ArrowUp: updateHighlightedCurrencyWithPrevious,
      ArrowDown: updateHighlightedCurrencyWithNext,
      Enter: updateCurrencyWithHighlighted
    });

    if (fn) {
      fn();
      e.preventDefault();
    }
  };

  watch(collapsed, async (v) => {
    if (!v) {
      search.value = "";
      highlightedCurrency.value = null;

      document.addEventListener("keydown", handleDocumentKeydown);

      await forceNextTick();

      scrollToActiveDropdownItem();

      window.addEventListener("click", collapse);
    } else {
      document.removeEventListener("keydown", handleDocumentKeydown);
      window.removeEventListener("click", collapse);
    }
  });

  watch(search, (v) => {
    if (v) {
      if (dropdownScroll.value) {
        dropdownScroll.value = 0;
      }

      if (!currencies.value.length) {
        highlightedCurrency.value = null;
        return;
      }

      if (
        !highlightedCurrency.value ||
        !currencies.value.includes(highlightedCurrency.value)
      ) {
        highlightedCurrency.value = currencies.value[0];
      }
    }
  });

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", handleDocumentKeydown);
    window.removeEventListener("click", collapse);
  });

  return {
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
  };
};
