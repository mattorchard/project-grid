export const debounce = <A>(callback: (args: A) => void, delay: number) => {
  let timeoutId: number | null = null;
  return (args: A) => {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(args), delay);
  };
};
