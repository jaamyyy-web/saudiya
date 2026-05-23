export function normalizeLivePack(pack, fallbackIndex = 0) {
  return {
    id: pack.id,
    title: pack.title || pack.name || 'Learning Pack',
    grade: pack.grade || 'الصف السابع',
    subject: pack.subject || 'General',
    subjectId: pack.subjectId || pack.subjectKey || String(pack.subject || 'general').toLowerCase(),
    progress: pack.progress || 0,
    locked: pack.locked === true || pack.isPremium === true,
    xp: pack.xp || 120,
    order: pack.order || fallbackIndex + 1,
    source: 'firestore',
  };
}

export function mergeLivePacksWithDemo(livePacks, demoPacks) {
  if (!Array.isArray(livePacks) || livePacks.length === 0) return demoPacks;
  return livePacks.map((pack, index) => normalizeLivePack(pack, index));
}

export function getDisplayStudent(student, demoStudent) {
  return {
    ...demoStudent,
    ...(student || {}),
    name: student?.name || demoStudent?.name || 'Student',
    grade: student?.grade || demoStudent?.grade || 'الصف السابع',
    xp: student?.xp ?? demoStudent?.xp ?? 0,
    streak: student?.streak ?? demoStudent?.streak ?? 0,
    accuracy: student?.accuracy ?? demoStudent?.accuracy ?? 0,
  };
}

export function getDisplayLeaderboard(liveLeaderboard, fallbackNames = []) {
  if (Array.isArray(liveLeaderboard) && liveLeaderboard.length > 0) {
    return liveLeaderboard.map((item, index) => ({
      rank: item.rank || index + 1,
      name: item.name || item.displayName || 'Student',
      xp: item.xp || 0,
      grade: item.grade || null,
    }));
  }

  return fallbackNames.map((name, index) => ({
    rank: index + 1,
    name,
    xp: 980 - index * 90,
  }));
}

export function getDisplayAnalytics(liveAnalytics, student) {
  return {
    accuracy: liveAnalytics?.accuracy || student?.accuracy || 0,
    completedPacks: liveAnalytics?.completedPacks || student?.completedPacks || 0,
    xp: liveAnalytics?.xp || student?.xp || 0,
    streak: liveAnalytics?.streak || student?.streak || 0,
    weakSubjects: liveAnalytics?.weakSubjects || [],
  };
}
