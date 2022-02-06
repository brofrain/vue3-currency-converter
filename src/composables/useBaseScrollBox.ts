import { ref, onMounted } from "vue";

export default () => {
  const containerEl = ref<HTMLDivElement>();

  const margin = ref("0");
  const padding = ref("0");
  const width = ref("100%");
  const height = ref("100%");

  const inheritParentPadding = () => {
    if (!containerEl.value?.parentElement) {
      return;
    }

    const { paddingTop, paddingRight, paddingBottom, paddingLeft } =
      getComputedStyle(containerEl.value.parentElement);

    const paddingArr = [
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft
    ] as const;

    margin.value = paddingArr.map((value) => `-${value}`).join(" ");
    padding.value = paddingArr.join(" ");

    width.value = `calc(100% + ${paddingRight} + ${paddingLeft})`;
    height.value = `calc(100% + ${paddingTop} + ${paddingBottom})`;
  };

  onMounted(inheritParentPadding);

  return { containerEl, margin, padding, width, height };
};
