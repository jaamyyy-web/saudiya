export function calculateAccuracy(correctCount = 0, totalQuestions = 0) {
  if (!totalQuestions) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}

export function buildCompletionStats(data = {}) {
  const correctCount = data.correctCount || 0;
  const totalQuestions = data.totalQuestions || 0;
  return {
    correctCount,
    totalQuestions,
    accuracy: calculateAccuracy(correctCount, totalQuestions),
    xpEarned: data.xpEarned || 120,
  };
}
