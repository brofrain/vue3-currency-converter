import type { ObjKey, ParamlessVoidFunction } from "@/types/basic";

export const capitalize = (str: string): Capitalize<string> =>
  str[0].toUpperCase() + str.slice(1);

const doubleRequestAnimationFrame = (callback: ParamlessVoidFunction) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
};

// based on: https://github.com/twickstrom/vue-force-next-tick
export const forceNextTick = (
  callback?: ParamlessVoidFunction
): Promise<unknown> | void => {
  if (callback && typeof callback === "function") {
    doubleRequestAnimationFrame(callback);
  } else {
    return new Promise((resolve) => {
      doubleRequestAnimationFrame(resolve as ParamlessVoidFunction);
    });
  }
};

export const preloadImg = async (src: string): Promise<Event> =>
  await new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.src = src;
  });

export const match =
  <T extends () => ReturnType<T>>(value: ObjKey) =>
  (callbackObj: Record<ObjKey, T>, defaultCallback?: T) =>
    value in callbackObj ? callbackObj[value] : defaultCallback;
