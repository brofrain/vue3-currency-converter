<template>
  <div id="navbar">
    <div class="nav-container">
      <div class="nav-brand">Vue 3 Currency Converter</div>

      <div class="nav-spacer" />

      <div
        class="nav-item-wrapper"
        :class="{ 'nav-item-wrapper--collapsed': collapsed }"
      >
        <div class="nav-item-wrapper__cover" />

        <div
          v-for="(route, i) in routes"
          :key="i"
          class="nav-item"
          :class="{ 'nav-item--active': route.name === currentRoute.name }"
          @click="$router.push(route)"
        >
          {{ route.name }}

          <div class="nav-item__underline" />
        </div>
      </div>

      <div class="nav-toggler" @click="collapsed = !collapsed">
        <b-icon class="nav-toggler__icon" icon="bars" />
      </div>

      <ThePreferencesButton @click="showPreferences = true" />
      <ThePreferencesModal v-model:show="showPreferences" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ThePreferencesButton, ThePreferencesModal } from "./navbar";

import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const { currentRoute, getRoutes } = useRouter();

const routes = getRoutes();

const collapsed = ref(true);

watch(currentRoute, () => {
  if (!collapsed.value) {
    collapsed.value = true;
  }
});

const showPreferences = ref(false);
</script>

<style lang="scss" scoped>
#navbar {
  z-index: 999;

  .nav-container {
    @include base__gradient--fixed;
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    height: 45px;
    user-select: none;
    box-shadow: 0 0 5px 0 $base__color--shadow;

    @media (min-width: 1400px) {
      padding: 0 20px;
      height: 50px;
    }

    @media (min-width: 1500px) {
      height: 50px;
    }

    .nav-brand {
      flex: 0 0 0;
      color: $base__color--primary;
      font-size: 1.1rem;
      font-weight: 600;
      white-space: nowrap;
    }

    .nav-spacer {
      flex: 1 0 0;
    }

    .nav-item-wrapper {
      display: flex;

      .nav-item {
        cursor: pointer;
        color: $base__color--primary;
        font-weight: 600;
        position: relative;

        .nav-item__underline {
          position: absolute;
          pointer-events: none;

          @include base__transition(opacity);
          opacity: 0;
        }

        &:hover {
          .nav-item__underline {
            opacity: 0.5;
          }
        }

        &.nav-item--active {
          .nav-item__underline {
            opacity: 1;
          }
        }
      }

      /* mobile devices */
      @media (max-width: 999.98px) {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: -1;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        overflow: hidden;
        height: auto;
        gap: 10px;
        padding: 10px;

        @include base__transition(transform, box-shadow);
        transform: none;
        box-shadow: 0 0 5px 0 $base__color--shadow;

        &.nav-item-wrapper--collapsed {
          transform: translateY(-100%);
          box-shadow: none;
        }

        .nav-item-wrapper__cover {
          @include base__cover;
          @include base__gradient--fixed;
          opacity: 0.7;
        }

        .nav-item {
          .nav-item__underline {
            height: 1px;
            left: 0;
            right: 0;
            bottom: 0;
            background: $base__color--primary;
          }
        }
      }

      /* non-mobile devices */
      @media (min-width: 1000px) {
        flex: 1 0 0;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        gap: 20px;

        .nav-item-wrapper__cover {
          display: none;
        }

        .nav-item {
          $x-padding: 5px;
          padding: 0 $x-padding;

          .nav-item__underline {
            height: 2px;
            left: $x-padding;
            right: $x-padding;
            bottom: -1px;
            background: $base__color--primary;
          }
        }
      }
    }

    .nav-toggler {
      .nav-toggler__icon {
        color: $base__color--primary;
        cursor: pointer;
        font-size: 1.9rem;

        @media (min-width: 1000px) {
          display: none;
        }
      }
    }
  }
}
</style>
