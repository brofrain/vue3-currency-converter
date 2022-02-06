<template>
  <b-transition>
    <div v-if="show" class="preferences-modal__container">
      <div class="preferences-modal__overlay" @click="hideModal" />

      <div class="preferences-modal">
        <div class="preferences-modal__content">
          <div class="preferences-modal__head">
            <div class="preferences-modal__head__text">Preferences</div>

            <b-outline-icon-btn icon="xmark" @click="hideModal" />
          </div>

          <div class="preferences-modal__body">
            <div>
              Starting page:

              <b-radio
                v-for="(route, i) in routes"
                :key="i"
                :model-value="route.path === startingPath"
                :label="route.name"
                @update:model-value="updateStartingPath(route.path)"
              />
            </div>

            <div>
              Color theme:

              <b-radio
                v-for="(item, i) in colorThemes"
                :key="i"
                :model-value="item === colorTheme"
                :label="capitalize(item)"
                @update:model-value="updateColorTheme(item)"
              />
            </div>

            <b-checkbox
              :model-value="keepChosenCurrencies"
              label="Keep chosen currencies"
              @update:model-value="updateKeepChosenCurrencies"
            />
          </div>
        </div>
      </div>
    </div>
  </b-transition>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { capitalize } from "@/helpers/utils";
import { usePreferencesStore } from "@/stores/preferences";

const $preferencesStore = usePreferencesStore();

const routes = useRouter().getRoutes();

defineProps<{ show: boolean }>();
const emit = defineEmits<{ (e: "update:show", show: boolean): void }>();

const hideModal = () => {
  emit("update:show", false);
};

const colorThemes = computed(() => $preferencesStore.COLOR_THEMES);

const colorTheme = computed(() => $preferencesStore.colorTheme);

const updateColorTheme = (themeKey: string) => {
  $preferencesStore.updateColorTheme(themeKey);
};

const keepChosenCurrencies = computed(
  () => $preferencesStore.keepChosenCurrencies
);

const updateKeepChosenCurrencies = (v: boolean) =>
  $preferencesStore.updateKeepChosenCurrencies(v);

const startingPath = computed(() => $preferencesStore.startingPath);

const updateStartingPath = (path: string) =>
  $preferencesStore.updateStartingPath(path);
</script>

<style lang="scss" scoped>
.preferences-modal__container {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;

  .preferences-modal__overlay {
    @include base__cover;
    background: #0006;
  }

  .preferences-modal {
    @include base__gradient--fixed;

    $round-radius: 15px;
    border-radius: $round-radius;
    padding: 2px;
    width: 20rem;
    max-width: 100%;
    position: relative;

    .preferences-modal__content {
      border-radius: $round-radius * 0.9;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 15px;
      position: relative;
      background: $base__color--primary;

      .preferences-modal__head {
        display: flex;
        justify-content: flex-end;
        position: relative;

        .preferences-modal__head__text {
          @include base__gradient-text--fixed;
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 1.2rem;
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .preferences-modal__body {
        display: flex;
        flex-direction: column;
        gap: 10px;
        color: $base__color--text;
        padding: 5px 10px;
      }
    }
  }
}
</style>
