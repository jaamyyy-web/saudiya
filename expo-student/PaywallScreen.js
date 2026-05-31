import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvailableProducts, purchaseSubscription, restorePurchases } from './billingService';

export default function PaywallScreen({ studentId, onDone, onBack, styles }) {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);
        const list = await getAvailableProducts();
        const mapped = list.map((item) => {
          if (item.product) {
            // RevenueCat Package object
            const identifier = item.product.identifier || '';
            const isFamily = identifier.includes('family');
            return {
              id: identifier,
              plan: isFamily ? 'family' : 'single',
              title: isFamily ? 'الخطة العائلية Premium' : 'الخطة الفردية Premium',
              priceLabel: item.product.priceString || (isFamily ? '99 SAR / شهر' : '39 SAR / شهر'),
              profilesAllowed: isFamily ? 4 : 1,
              deviceLimit: isFamily ? 6 : 2,
              rcPackage: item,
            };
          } else {
            // Static fallback product
            const isFamily = item.plan === 'family';
            return {
              id: item.id,
              plan: item.plan,
              title: isFamily ? 'الخطة العائلية Premium' : 'الخطة الفردية Premium',
              priceLabel: item.priceLabel,
              profilesAllowed: item.profilesAllowed,
              deviceLimit: item.deviceLimit,
              rcPackage: null,
            };
          }
        });
        setProducts(mapped);
      } catch (error) {
        console.warn('[Billing] Failed to load products:', error.message);
      } finally {
        setLoadingProducts(false);
      }
    }
    loadProducts();
  }, []);

  async function buy(product) {
    try {
      setLoadingPlan(product.plan);
      setMessage('');
      const result = await purchaseSubscription({
        studentId,
        plan: product.plan,
        rcPackage: product.rcPackage,
      });
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

  async function handleRestore() {
    try {
      setRestoring(true);
      setMessage('');
      const result = await restorePurchases(studentId);
      if (result.restored) {
        setMessage('تم استعادة اشتراكك بنجاح!');
        onDone?.();
      } else {
        setMessage(result.message || 'لم نتمكن من العثور على اشتراك نشط لهذا الحساب.');
      }
    } catch (error) {
      setMessage(error.message || 'فشلت عملية استعادة الاشتراك.');
    } finally {
      setRestoring(false);
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

        {loadingProducts ? (
          <Text style={styles.progress}>جاري تحميل الخطط والأسعار...</Text>
        ) : (
          products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.answer}
              onPress={() => buy(product)}
              disabled={Boolean(loadingPlan) || restoring}
            >
              <Text style={styles.answerText}>{product.title}</Text>
              <Text style={styles.centerText}>{product.priceLabel}</Text>
              <Text style={styles.centerText}>
                عدد المستخدمين: {product.profilesAllowed} • عدد الأجهزة: {product.deviceLimit}
              </Text>
              <Text style={styles.progress}>
                {loadingPlan === product.plan ? 'جاري الاتصال بالمتجر...' : 'اضغط للاشتراك'}
              </Text>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={styles.secondary}
          onPress={handleRestore}
          disabled={Boolean(loadingPlan) || restoring}
        >
          <Text style={styles.secondaryText}>
            {restoring ? 'جاري التحقق من المتجر...' : 'استعادة المشتريات السابقة'}
          </Text>
        </TouchableOpacity>

        {message ? <Text style={styles.progress}>{message}</Text> : null}
      </View>
    </View>
  );
}

