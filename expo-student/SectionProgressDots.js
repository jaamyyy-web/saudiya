import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSectionState } from './learningFlowService';

export default function SectionProgressDots({ flowSteps, stepIndex, completedSectionIds = [], onSelectSection, styles }) {
  return (
    <View style={styles.stepRow}>
      {flowSteps.map((item, index) => {
        const state = getSectionState(item.id, completedSectionIds);
        const active = index === stepIndex;
        const enabled = state.unlocked || state.completed;

        return (
          <TouchableOpacity
            key={item.id}
            disabled={!enabled}
            onPress={() => enabled && onSelectSection?.(item.id)}
            style={[
              styles.stepDot,
              (active || state.completed) && styles.stepActive,
              state.locked && { opacity: 0.45 },
            ]}
          >
            <Ionicons
              name={state.completed ? 'checkmark' : state.locked ? 'lock-closed' : item.icon}
              size={15}
              color={(active || state.completed) ? 'white' : '#94a3b8'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
