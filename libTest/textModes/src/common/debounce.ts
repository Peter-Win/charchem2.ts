export interface DebounceCounter {
  counter?: number;
}

/* eslint-disable no-param-reassign */

export const debounce = (
  counter: DebounceCounter,
  ms: number,
  action: () => void,
) => {
  counter.counter = counter.counter || 0;
  counter.counter += 1;
  setTimeout(() => {
    if (counter.counter) {
      counter.counter -= 1;
    }
    if (counter.counter === 0) {
      action();
    }
  }, ms);
};
