<template>
  <div ref="tableEl" class="base__table">
    <div class="base__table__head">
      <div
        v-for="(item, index) in activeColNames"
        :key="index"
        :ref="(el) => pushCellEl(el as HTMLDivElement | null, index)"
        :class="`base__table__head__item--${activeColTextAligns[index]}`"
      >
        {{ item }}
      </div>
    </div>

    <div class="base__table__body">
      <div
        v-for="(row, rowIndex) in activeRows"
        :key="rowIndex"
        class="base__table__body__row"
      >
        <div class="base__table__body__row__cover" />

        <div
          v-for="(item, index) in row"
          :key="index"
          :ref="(el) => pushCellEl(el as HTMLDivElement | null, index)"
          :class="`base__table__body__row__item--${activeColTextAligns[index]}`"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBaseTableActiveData, useBaseTableCellWidths } from "@/composables";
import type { BaseTableProps } from "@/types/components";

// imported interfaces passed to defineProps() are not yet supported
// using this as a workaround
const props = defineProps<{
  cols: BaseTableProps["cols"];
  rows: BaseTableProps["rows"];
}>();

const { tableEl, activeColNames, activeColTextAligns, activeRows } =
  useBaseTableActiveData(props);

const { pushCellEl } = useBaseTableCellWidths();
</script>

<style lang="scss" scoped>
@mixin cell {
  width: auto;
  display: flex;
  align-items: center;
  white-space: nowrap;

  @include base__transition(min-width);
}

.base__table {
  border-radius: 15px;
  box-shadow: 0 0 5px 2px $base__color--shadow;
  overflow: hidden;
  position: relative;

  display: flex;
  flex-direction: column;

  --row__x-padding: 10px;
  --row__item-gap: 5px;

  @media (min-width: 500px) {
    --row__x-padding: 15px;
    --row__item-gap: 20px;
  }

  @media (min-width: 900px) {
    --row__x-padding: 20px;
    --row__item-gap: 30px;
  }

  $row__padding: 0 var(--row__x-padding);
  $row__item-gap: var(--row__item-gap);

  .base__table__head {
    padding: $row__padding;
    gap: $row__item-gap;

    height: 2.4rem;
    display: flex;
    font-size: 1.1rem;
    font-weight: 600;
    background: $base__color--primary;
    user-select: none;

    .base__table__head__item--start,
    .base__table__head__item--center,
    .base__table__head__item--end {
      @include cell;
      @include base__gradient-text--fixed;
    }

    .base__table__head__item--start {
      justify-content: flex-start;
    }

    .base__table__head__item--center {
      justify-content: center;
    }

    .base__table__head__item--end {
      justify-content: flex-end;
    }
  }

  .base__table__body {
    display: flex;
    flex-direction: column;

    .base__table__body__row {
      padding: $row__padding;
      gap: $row__item-gap;

      height: 2.2rem;
      display: flex;
      position: relative;

      @include base__transition(color, text-shadow);
      color: $base__color--text;

      .base__table__body__row__cover {
        @include base__cover;
        @include base__gradient--fixed;
        pointer-events: none;

        @include base__transition--gradient(opacity);
        opacity: 0;
      }

      .base__table__body__row__item--start,
      .base__table__body__row__item--center,
      .base__table__body__row__item--end {
        @include cell;

        position: relative;
      }

      .base__table__body__row__item--start {
        justify-content: flex-start;
      }

      .base__table__body__row__item--center {
        justify-content: center;
      }

      .base__table__body__row__item--end {
        justify-content: flex-end;
      }

      &:nth-child(2n) {
        background: $base__color--primary;
      }

      &:nth-child(2n - 1) {
        background: $base__color--secondary;
      }

      &:hover {
        color: $base__color--primary;
        text-shadow: 0 0 1px $base__color--primary;

        .base__table__body__row__cover {
          opacity: 1;
        }
      }
    }
  }
}
</style>
