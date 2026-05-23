import { useEffect, useMemo, useState } from 'react';
import { useStudentAuth } from './useStudentAuth';
import {
  subscribeLeaderboard,
  subscribePublishedLearningPacks,
  subscribeStudentProfile,
  subscribeStudentProgress,
} from './liveStudentData';

export function useLiveStudentAppData(studentIdOverride = null) {
  const { studentId: authStudentId, loading: authLoading } = useStudentAuth();
  const studentId = studentIdOverride || authStudentId || 'demo-student';
  const [student, setStudent] = useState(null);
  const [livePacks, setLivePacks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (authLoading && !studentIdOverride) return undefined;

    setLoading(true);
    const recordError = (error) => setErrors((current) => [...current, error.message]);

    const unsubProfile = subscribeStudentProfile(studentId, (data) => {
      setStudent({ ...data, id: studentId });
      setLoading(false);
    }, recordError);

    const unsubPacks = subscribePublishedLearningPacks({}, (data) => {
      setLivePacks(data);
      setLoading(false);
    }, recordError);

    const unsubProgress = subscribeStudentProgress(studentId, (data) => {
      setProgress(data);
    }, recordError);

    const unsubLeaderboard = subscribeLeaderboard({}, (data) => {
      setLeaderboard(data);
    }, recordError);

    return () => {
      unsubProfile && unsubProfile();
      unsubPacks && unsubPacks();
      unsubProgress && unsubProgress();
      unsubLeaderboard && unsubLeaderboard();
    };
  }, [studentId, studentIdOverride, authLoading]);

  const completedPackIds = useMemo(() => {
    return new Set(progress.filter((item) => item.status === 'completed').map((item) => item.packId));
  }, [progress]);

  const analytics = useMemo(() => {
    const completedPacks = progress.filter((item) => item.status === 'completed').length;
    const totalAccuracy = progress.reduce((sum, item) => sum + (item.accuracy || 0), 0);
    const accuracy = progress.length ? Math.round(totalAccuracy / progress.length) : (student?.accuracy || 0);

    return {
      completedPacks,
      accuracy,
      xp: student?.xp || 0,
      streak: student?.streak || 0,
      weakSubjects: progress.filter((item) => item.accuracy !== undefined && item.accuracy < 60),
    };
  }, [progress, student]);

  return {
    student,
    studentId,
    livePacks,
    progress,
    leaderboard,
    completedPackIds,
    analytics,
    loading: loading || (authLoading && !studentIdOverride),
    errors,
  };
}
