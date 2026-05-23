import { useEffect, useMemo, useState } from 'react';
import {
  subscribeLeaderboard,
  subscribePublishedLearningPacks,
  subscribeStudentProfile,
  subscribeStudentProgress,
} from './liveStudentData';

export function useLiveStudentAppData(studentId = 'demo-student') {
  const [student, setStudent] = useState(null);
  const [livePacks, setLivePacks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setLoading(true);
    const recordError = (error) => setErrors((current) => [...current, error.message]);

    const unsubProfile = subscribeStudentProfile(studentId, (data) => {
      setStudent(data);
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
  }, [studentId]);

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
    livePacks,
    progress,
    leaderboard,
    completedPackIds,
    analytics,
    loading,
    errors,
  };
}
