type BaseTableColumn =
  | string
  | {
      value: string;
      textAlign?: "start" | "center" | "end";
      isInferior?: boolean;
    };

export default interface BaseTableProps {
  cols: BaseTableColumn[];
  rows: (string | number)[][];
}
