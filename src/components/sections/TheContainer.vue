<template>
  <div id="appContainer">
    <div id="appContainerImgCover" ref="imgCoverEl" />

    <b-scroll>
      <TheView />

      <TheFooter />
    </b-scroll>
  </div>
</template>

<script lang="ts" setup>
import { TheView, TheFooter } from "./container";

import cashBg2400x1800Img from "@/assets/cash-annie-spratt-unsplash-2400x1800.jpg";
import cashBg1920x1440Img from "@/assets/cash-annie-spratt-unsplash-1920x1440.jpg";

import { ref, onMounted } from "vue";
import { preloadImg } from "@/helpers/utils";

const imgCoverEl = ref<HTMLDivElement>();

const bgImg =
  window.innerWidth > 2000 ? cashBg2400x1800Img : cashBg1920x1440Img;

const setBgOpacity = () => {
  if (imgCoverEl.value && imgCoverEl.value.style.opacity !== "1") {
    imgCoverEl.value.style.opacity = "1";
  }
};

const setBgImg = () => {
  if (imgCoverEl.value) {
    imgCoverEl.value.style.backgroundImage = `url(${bgImg})`;
  }
};

let isImgLoaded = false;
(async () => {
  await preloadImg(bgImg);
  setBgOpacity();
  isImgLoaded = true;
})();

onMounted(() => {
  setBgImg();

  if (isImgLoaded) {
    setBgOpacity();
  }
});
</script>

<style lang="scss" scoped>
#appContainer {
  flex: 1 0 0;
  overflow: hidden;
  background: $base__color--primary;

  #appContainerImgCover {
    @include base__cover;
    pointer-events: none;
    background: center / cover no-repeat fixed;
    box-shadow: inset 0 0 0 1000px $base__color--container-cover;
    filter: grayscale(100%);

    background-image: none;

    @include base__transition(opacity);
    opacity: 0;
  }
}
</style>
