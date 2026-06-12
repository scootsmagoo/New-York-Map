const MAX_CONCURRENT = 3;
let active = 0;
const queue: Array<() => void> = [];

function drain(): void {
  while (active < MAX_CONCURRENT && queue.length > 0) {
    const next = queue.shift();
    next?.();
  }
}

/** Limit parallel Wikipedia fetches so the era panel doesn't stampede the API. */
export function runWikiQueued<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = () => {
      active++;
      fn()
        .then(resolve, reject)
        .finally(() => {
          active--;
          drain();
        });
    };
    if (active < MAX_CONCURRENT) run();
    else queue.push(run);
  });
}
