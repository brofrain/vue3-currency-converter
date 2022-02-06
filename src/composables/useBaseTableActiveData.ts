import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { isObj } from "@/helpers/typeChecks";
import type { BaseTableProps } from "@/types/components";

const DEFAULT_COL_TEXT_ALIGN = "center";

export default (props: BaseTableProps) => {
  const tableEl = ref<HTMLDivElement>();

  const collapseInferiorCols = ref(false);
  const uncollapsedTableElWidth = ref(0);

  const updateUncollapsedTableElWidth = () => {
    if (collapseInferiorCols.value || !tableEl.value) {
      return;
    }

    uncollapsedTableElWidth.value = tableEl.value.offsetWidth;
  };

  const checkIfParentElIsWideEnough = () => {
    if (!tableEl.value?.parentElement) {
      return;
    }

    collapseInferiorCols.value =
      tableEl.value.parentElement.offsetWidth < uncollapsedTableElWidth.value;
  };

  const tableElResizeObserver = new ResizeObserver(
    updateUncollapsedTableElWidth
  );
  const tableParentElResizeObserver = new ResizeObserver(
    checkIfParentElIsWideEnough
  );

  onMounted(() => {
    if (!tableEl.value?.parentElement) {
      return;
    }

    tableElResizeObserver.observe(tableEl.value);
    tableParentElResizeObserver.observe(tableEl.value.parentElement);
  });

  onBeforeUnmount(() => {
    tableElResizeObserver.disconnect();
    tableParentElResizeObserver.disconnect();
  });

  const collapsedColIndexes = computed(() => {
    const indexes: number[] = [];

    if (!collapseInferiorCols.value) {
      return indexes;
    }

    for (const [index, item] of props.cols.entries()) {
      if (isObj(item) && item.isInferior) {
        indexes.push(index);
      }
    }

    return indexes;
  });

  const filterCollapsed = (cols: unknown[]) =>
    cols.filter((_, index) => !collapsedColIndexes.value.includes(index));

  const activeCols = computed(() => filterCollapsed(props.cols));

  const activeColNames = computed(() =>
    activeCols.value.map((item) => (isObj(item) ? item.name : item))
  );

  const activeColTextAligns = computed(() =>
    activeCols.value.map((item) =>
      isObj(item) && item.textAlign ? item.textAlign : DEFAULT_COL_TEXT_ALIGN
    )
  );

  const activeRows = computed(() =>
    props.rows.map((row) => filterCollapsed(row))
  );

  return { tableEl, activeColNames, activeColTextAligns, activeRows };
};
