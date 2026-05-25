const counters = new Map<string, number>();

export function incrementMetric(name: string, value = 1) {
  counters.set(name, (counters.get(name) ?? 0) + value);
}

export function getMetric(name: string) {
  return counters.get(name) ?? 0;
}

export function getMetricsSnapshot() {
  return Object.fromEntries(counters.entries());
}
