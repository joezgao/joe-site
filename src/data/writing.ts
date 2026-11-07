// Helpers shared by the Writing pages, Home and Work.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Essay = CollectionEntry<'writing'>;

/** The three essays in order (the intro, order 0, is excluded). */
export async function getEssays(): Promise<Essay[]> {
  const all = await getCollection('writing');
  return all.filter((e) => e.data.order > 0).sort((a, b) => a.data.order - b.data.order);
}

export async function getIntro(): Promise<Essay | undefined> {
  return (await getCollection('writing')).find((e) => e.data.order === 0);
}

/** Essay written about a given work, keyed by work id. */
export async function essaysByWork(): Promise<Map<string, Essay>> {
  const map = new Map<string, Essay>();
  for (const e of await getEssays()) if (e.data.work) map.set(e.data.work, e);
  return map;
}

export const essayHref = (e: Essay) => `/writing/${e.id}`;

/** Whole minutes at ~230 words a minute. */
export const readingMinutes = (e: Essay) => Math.max(1, Math.round((e.body ?? '').split(/\s+/).length / 230));

const CONFIRM = '[Joe to confirm]';
/**
 * The essay's rendered HTML with the vault's editorial marker "[Joe to confirm]" shown as a small tag,
 * so a draft shows Joe which lines wait for his approval. The Markdown stays a verbatim copy of the vault.
 */
export const essayHtml = (e: Essay): string | undefined =>
  e.rendered?.html.replaceAll(CONFIRM, '<mark class="confirm">Joe to confirm</mark>');
