export const LEARNING_SECTION_ORDER = ['summary', 'mcq', 'fib', 'tf', 'hoq'];

export function getSectionIndex(sectionId) {
  const index = LEARNING_SECTION_ORDER.indexOf(sectionId);
  return index >= 0 ? index : 0;
}

export function getUnlockedSectionIds(completedSectionIds = []) {
  const completed = new Set(completedSectionIds);
  const unlocked = new Set(['summary']);

  for (let i = 0; i < LEARNING_SECTION_ORDER.length; i += 1) {
    const current = LEARNING_SECTION_ORDER[i];
    const next = LEARNING_SECTION_ORDER[i + 1];
    if (completed.has(current) && next) {
      unlocked.add(next);
    }
  }

  return unlocked;
}

export function canOpenSection(sectionId, completedSectionIds = []) {
  return getUnlockedSectionIds(completedSectionIds).has(sectionId);
}

export function getNextSectionId(sectionId) {
  const index = getSectionIndex(sectionId);
  return LEARNING_SECTION_ORDER[index + 1] || null;
}

export function markSectionComplete(completedSectionIds = [], sectionId) {
  return Array.from(new Set([...completedSectionIds, sectionId]));
}

export function getSectionState(sectionId, completedSectionIds = []) {
  const completed = completedSectionIds.includes(sectionId);
  const unlocked = canOpenSection(sectionId, completedSectionIds);
  return {
    completed,
    unlocked,
    locked: !unlocked,
  };
}
