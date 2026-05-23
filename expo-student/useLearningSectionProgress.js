import { useCallback, useMemo, useState } from 'react';
import { getSectionIndex, markSectionComplete } from './learningFlowService';

export function useLearningSectionProgress(initialSection = 'summary') {
  const [activeSectionId, setActiveSectionId] = useState(initialSection);
  const [completedSectionIds, setCompletedSectionIds] = useState([]);

  const stepIndex = useMemo(() => getSectionIndex(activeSectionId), [activeSectionId]);

  const completeSection = useCallback((sectionId) => {
    setCompletedSectionIds((current) => markSectionComplete(current, sectionId));
  }, []);

  const resetSections = useCallback(() => {
    setActiveSectionId(initialSection);
    setCompletedSectionIds([]);
  }, [initialSection]);

  return {
    activeSectionId,
    setActiveSectionId,
    completedSectionIds,
    setCompletedSectionIds,
    completeSection,
    resetSections,
    stepIndex,
  };
}
