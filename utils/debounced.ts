export const debounce = (func: any, delay: number) => {
  let timerId = 0 as any;
  return (...args: any) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
