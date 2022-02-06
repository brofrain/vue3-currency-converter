import {
  nextTick,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUpdated
} from "vue";

export default () => {
  let cellEls: HTMLDivElement[][] = [];

  const updateMaxAutoWidthPerCol = async () => {
    for (const col of cellEls) {
      for (const el of col) {
        el.style.minWidth = "auto";
      }
    }

    await nextTick();

    for (const col of cellEls) {
      let maxAutoWidth = 0;
      for (const el of col) {
        if (el.offsetWidth && el.offsetWidth > maxAutoWidth) {
          maxAutoWidth = el.offsetWidth;
        }
      }
      for (const el of col) {
        el.style.minWidth = `${maxAutoWidth}px`;
      }
    }
  };

  const collElsResizeObserver = new ResizeObserver(updateMaxAutoWidthPerCol);

  const pushCellEl = (el: HTMLDivElement | null, colIndex: number) => {
    if (!el) {
      return;
    }

    if (!cellEls[colIndex]) {
      cellEls[colIndex] = [];
    }

    cellEls[colIndex].push(el);
    collElsResizeObserver.observe(el);
  };

  onBeforeUpdate(() => {
    cellEls = [];
    collElsResizeObserver.disconnect();
  });

  onUpdated(updateMaxAutoWidthPerCol);
  onMounted(updateMaxAutoWidthPerCol);

  onBeforeUnmount(() => {
    collElsResizeObserver.disconnect();
  });

  return { pushCellEl };
};
