export const isNum = (value: unknown): value is number =>
  typeof value === "number";

export const isObj = (value: unknown): value is Record<string, unknown> =>
  value === Object(value);
