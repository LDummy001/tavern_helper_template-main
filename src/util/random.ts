export type RandomEvent = { event: any; weighting: number };

export function select(random_events: RandomEvent[]) {
  let total_weight = 0;
  for (const random_event of random_events) {
    total_weight += random_event.weighting;
  }
  let random = Math.random() * total_weight;
  for (const random_event of random_events) {
    random -= random_event.weighting;
    if (random <= 0) return random_event.event;
  }
  return random_events[-1].event;
}
