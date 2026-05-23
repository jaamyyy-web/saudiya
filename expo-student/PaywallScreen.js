import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvailableProducts, purchaseSubscription } from './billingService';

export default function PaywallScreen({ studentId, onDone, onBack, styles }) {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [message, setMessage] = useState('');
  const products = Object.values(getStaticProducts());

  async function buy(plan) {
    try {
      setLoadingPlan(plan);
      setMessage('');
      const result = await purchaseSubscription({ studentId, plan });
      if (result?.success) {
        setMessage('تم تفعيل Premium بنجاح.');
        onDone?.();
      }
    } catch (error) {
      setMessage(error.message || 'تعذر تفعيل الاشتراك حالياً.');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <View>
      {onBack ? (
        <TouchableOpacity style={styles.back} onPress={onBack}>
          <Ionicons name="arrow-forward" size={18} color="#047857" />
          <Text style={styles.backText}>رجوع</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.locked}>
        <Ionicons name="diamond" size={52} color="#d97706" />
        <Text style={styles.detailTitle}>افتح Premium</Text>
        <Text style={styles.centerText}>احصل على كل الحزم، الاختبارات، الشروحات، والتحليلات الذكية.</Text>

        {products.map((product) => (
          <TouchableOpacity key={product.id} style={styles.answer} onPress={() => buy(product.plan)} disabled={Boolean(loadingPlan)}>
            <Text style={styles.answerText}>{product.title}</Text>
            <Text style={styles.centerText}>{product.priceLabel}</Text>
            <Text style={styles.centerText}>{product.profilesAllowed} profile • {product.deviceLimit} devices</Text>
            <Text style={styles.progress}>{loadingPlan === product.plan ? 'جاري التفعيل...' : 'اضغط للاشتراك'}</Text>
          </TouchableOpacity>
        ))}

        {message ? <Text style={styles.progress}>{message}</Text> : null}
      </View>
    </View>
  );
}

function getStaticProducts() {
  return {
    singleMonthly: {
      id: 'saudiedu_single_monthly',
      plan: 'single',
      title: 'Single Premium',
      priceLabel: '39 SAR / month',
      profilesAllowed: 1,
      deviceLimit: 2,
    },
    familyMonthly: {
      id: 'saudiedu_family_monthly',
      plan: 'family',
      title: 'Family Premium',
      priceLabel: '99 SAR / month',
      profilesAllowed: 4,
      deviceLimit: 6,
    },
  };
}
