<template>
  <div
    ref="containerEl"
    class="base__scroll__container"
    :style="{ margin, height, width }"
  >
    <div
      ref="slotWrapperEl"
      class="base__scroll__slot-wrapper"
      :style="{ padding }"
      @scroll="handleScroll"
    >
      <slot />
    </div>

    <b-transition>
      <div v-show="showScroll" class="base__scroll">
        <div class="base__scroll__track" @mousedown.stop="startTrackScroll">
          <div
            class="base__scroll__handle"
            :class="{ 'base__scroll__handle--down': isScrollHandleDown }"
            :style="{
              height: scrollHandleHeight,
              top: scrollHandleTop
            }"
            @mousedown.stop="startMouseScroll"
          >
            <div class="base__scroll__handle__cover" />
          </div>
        </div>
      </div>
    </b-transition>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  onMounted,
  nextTick,
  onBeforeUnmount,
  watch
} from "vue";
import { isNum } from "@/helpers/typeChecks";
import { forceNextTick } from "@/helpers/utils";
import { useBaseScrollBox } from "@/composables";

const props = defineProps<{ modelValue?: number }>();

const emit = defineEmits<{
  (e: "update:model-value", value: number): void;
}>();

const { containerEl, margin, padding, width, height } = useBaseScrollBox();

const slotWrapperEl = ref<HTMLDivElement>();

const scrollHandleHeightPercentValue = ref(100);
const scrollHandleTopPxValue = ref(0);

const bodyEl = ref(document.querySelector("body"));

const isScrollHandleDown = ref(false);
const beforeMouseScrollStartDownY = ref<number | null>(null);
const beforeMouseScrollStartScrollTop = ref<number | null>(null);

const scrollHandleHeight = computed(
  () => `${scrollHandleHeightPercentValue.value}%`
);
const scrollHandleTopPercentValue = computed(() =>
  slotWrapperEl.value
    ? Math.min(
        100 - scrollHandleHeightPercentValue.value,
        (scrollHandleTopPxValue.value / slotWrapperEl.value.scrollHeight) * 100
      )
    : 0
);
const scrollHandleTop = computed(() => `${scrollHandleTopPercentValue.value}%`);

const showScroll = computed(() => scrollHandleHeightPercentValue.value !== 100);

const setScrollHandleHeight = () => {
  scrollHandleHeightPercentValue.value = slotWrapperEl.value?.scrollHeight
    ? Math.min(
        100,
        (slotWrapperEl.value.offsetHeight / slotWrapperEl.value.scrollHeight) *
          100
      )
    : 100;
};

const handleScroll = () => {
  const scrollTop = slotWrapperEl.value?.scrollTop || 0;

  scrollHandleTopPxValue.value = scrollTop;
  emit("update:model-value", scrollTop);
};

const scrollByMouse = (e: MouseEvent) => {
  if (
    !slotWrapperEl.value ||
    beforeMouseScrollStartDownY.value === null ||
    beforeMouseScrollStartScrollTop.value === null
  ) {
    return;
  }

  const scrollMoveTopPx = beforeMouseScrollStartDownY.value - e.clientY;
  const scrollMoveTopPercent =
    scrollMoveTopPx / slotWrapperEl.value.offsetHeight;

  slotWrapperEl.value.scroll({
    top:
      beforeMouseScrollStartScrollTop.value -
      scrollMoveTopPercent * slotWrapperEl.value.scrollHeight
  });
};

const startMouseScroll = (e: MouseEvent) => {
  if (!slotWrapperEl.value) {
    return;
  }

  isScrollHandleDown.value = true;
  beforeMouseScrollStartDownY.value = e.clientY;
  beforeMouseScrollStartScrollTop.value = slotWrapperEl.value.scrollTop;

  window.addEventListener("mousemove", scrollByMouse);
  window.addEventListener("mouseup", endMouseScroll);
  bodyEl.value?.addEventListener("mouseleave", endMouseScroll);
};

const endMouseScroll = () => {
  isScrollHandleDown.value = false;
  beforeMouseScrollStartDownY.value = null;
  beforeMouseScrollStartScrollTop.value = null;

  window.removeEventListener("mousemove", scrollByMouse);
  window.removeEventListener("mouseup", endMouseScroll);
  bodyEl.value?.removeEventListener("mouseleave", endMouseScroll);
};

const startTrackScroll = (e: MouseEvent) => {
  if (!slotWrapperEl.value) {
    return;
  }

  const clickY = e.offsetY;

  const checkIfMouseDownAboveHandle = () =>
    slotWrapperEl.value
      ? clickY <
        ((scrollHandleHeightPercentValue.value / 2 +
          scrollHandleTopPercentValue.value) /
          100) *
          slotWrapperEl.value.offsetHeight
      : false;

  const mouseDownAboveHandle = checkIfMouseDownAboveHandle();

  let scrollInterval: number | null = null;

  const endTrackScroll = () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
    }
    window.removeEventListener("mouseup", endTrackScroll);
  };
  window.addEventListener("mouseup", endTrackScroll);

  scrollInterval = setInterval(() => {
    if (!slotWrapperEl.value) {
      return;
    }

    if (mouseDownAboveHandle !== checkIfMouseDownAboveHandle()) {
      endTrackScroll();
      return;
    }

    const top =
      (mouseDownAboveHandle ? -10 : 10) + slotWrapperEl.value.scrollTop;
    slotWrapperEl.value.scroll({ top });
  }, 1);
};

const scrollByModelValue = (scroll: number, behavior: "auto" | "smooth") => {
  if (!slotWrapperEl.value) {
    return;
  }

  const top = Math.max(0, scroll - slotWrapperEl.value.offsetHeight / 2);
  slotWrapperEl.value.scroll({ top, behavior });
};

watch(
  () => props.modelValue,
  (v) => {
    if (v !== scrollHandleTopPxValue.value && isNum(v)) {
      scrollByModelValue(v, "smooth");
    }
  }
);

const slotContentResizeObserver = new ResizeObserver(setScrollHandleHeight);

const observeSlotChildren = () => {
  slotContentResizeObserver.disconnect();

  if (!slotWrapperEl.value?.children) {
    return;
  }

  const slotChildren = slotWrapperEl.value.children;
  for (let i = 0; i < slotChildren.length; i++) {
    slotContentResizeObserver.observe(slotChildren[i]);
  }
};

const slotWrapperElMutationObserver = new MutationObserver(observeSlotChildren);

onMounted(async () => {
  await nextTick();

  setScrollHandleHeight();

  observeSlotChildren();

  if (slotWrapperEl.value) {
    slotWrapperElMutationObserver.observe(slotWrapperEl.value, {
      childList: true
    });
  }

  await forceNextTick();
  if (props.modelValue) {
    scrollByModelValue(props.modelValue, "auto");
  }
});

onBeforeUnmount(() => {
  slotContentResizeObserver.disconnect();
  slotWrapperElMutationObserver.disconnect();
});
</script>

<style lang="scss" scoped>
@mixin parent-content-properties {
  display: inherit;
  flex-flow: inherit;
  grid: inherit;
  justify-content: inherit;
  justify-items: inherit;
  align-content: inherit;
  align-items: inherit;
  gap: inherit;
  border-radius: inherit;
}

.base__scroll__container {
  @include parent-content-properties;
  position: relative;
  overflow: visible;

  .base__scroll__slot-wrapper {
    @include base__cover;
    @include parent-content-properties;

    max-width: 100%;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .base__scroll {
    position: absolute;
    user-select: none;
    height: 100%;
    top: 0;
    bottom: 0;
    right: 1px;

    width: 10px;

    .base__scroll__track {
      width: 100%;
      height: 100%;
      position: relative;

      .base__scroll__handle {
        position: absolute;
        width: 100%;
        border-radius: 9999px;
        box-shadow: 0 0 5px 0 $base__color--shadow;

        @include base__transition(background, height);
        background: #000c;

        .base__scroll__handle__cover {
          @include base__cover;
          @include base__gradient--fixed;
          pointer-events: none;

          @include base__transition(opacity);
          opacity: 0;
        }

        &:hover {
          background: #0000;

          .base__scroll__handle__cover {
            opacity: 0.4;
          }
        }

        &.base__scroll__handle--down {
          background: #0000;

          .base__scroll__handle__cover {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
