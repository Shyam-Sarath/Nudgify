import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, Image, ScrollView,
  Pressable, Alert, Animated
} from 'react-native';
import { useTheme } from '../../theme';
import { Card, Button, Divider } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = [
  { key: 'pending',   label: 'Order Received',    sub: 'Your order is confirmed',         emoji: '🧾' },
  { key: 'preparing', label: 'Chef is Cooking',    sub: 'Fresh meal being prepared',       emoji: '🍳' },
  { key: 'ready',     label: 'Out for Delivery',   sub: 'Heading to your location',        emoji: '🛵' },
  { key: 'delivered', label: 'Delivered',          sub: 'Enjoy your homemade meal!',       emoji: '🎉' },
];

const STATUS_ORDER = ['pending', 'preparing', 'ready', 'delivered'];

export default function OrderTrackingScreen({ route, navigation }) {
  const { order } = route.params;
  const { colors, spacing, radius, typography } = useTheme();

  const [countdown, setCountdown] = useState({ min: 12, sec: 45 });
  const [timelineStatus] = useState(order.status?.toLowerCase() || 'pending');
  const pulseAnim = useState(new Animated.Value(1))[0];

  const currentIdx = STATUS_ORDER.indexOf(timelineStatus);
  const isDelivered = timelineStatus === 'delivered' || timelineStatus === 'completed';

  // Countdown timer
  useEffect(() => {
    if (isDelivered) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev.min === 0 && prev.sec === 0) { clearInterval(interval); return prev; }
        if (prev.sec === 0) return { min: prev.min - 1, sec: 59 };
        return { min: prev.min, sec: prev.sec - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation for the active step
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const isActive = (key: string) => STATUS_ORDER.indexOf(key) <= currentIdx;

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, {
        paddingHorizontal: spacing.containerPaddingMobile,
        backgroundColor: colors.primary,
      }]}>
        <Pressable onPress={() => navigation.navigate('HomeMain')} style={styles.backBtn}>
          <Text style={styles.backText}>← Home</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { fontFamily: typography.fontFamilies.heading }]}>
          Track Order
        </Text>
        <Text style={[styles.orderId, { fontFamily: typography.fontFamilies.primary }]}>
          #NDG-{order.id}
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: spacing.containerPaddingMobile }]} showsVerticalScrollIndicator={false}>

        {/* Countdown / ETA Card */}
        {isDelivered ? (
          <View style={[styles.deliveredBanner, { backgroundColor: '#10B98115', borderColor: '#10B981', borderRadius: radius.default }]}>
            <Text style={styles.deliveredEmoji}>🎉</Text>
            <View>
              <Text style={[styles.deliveredTitle, { color: '#10B981', fontFamily: typography.fontFamilies.heading }]}>
                Delivered!
              </Text>
              <Text style={[styles.deliveredSub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                We hope you enjoyed your homemade meal.
              </Text>
            </View>
          </View>
        ) : (
          <Card variant="flat" style={[styles.etaCard, { backgroundColor: colors.surfaceContainerLow }]}>
            <Text style={[styles.etaLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              ESTIMATED ARRIVAL
            </Text>
            <Animated.Text style={[styles.etaTime, { color: colors.primary, fontFamily: typography.fontFamilies.heading, transform: [{ scale: pulseAnim }] }]}>
              {pad(countdown.min)}:{pad(countdown.sec)}
            </Animated.Text>
            <Text style={[styles.etaSub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              {STEPS.find((s) => s.key === timelineStatus)?.sub || 'Processing your order'}
            </Text>
          </Card>
        )}

        {/* Map Placeholder */}
        <View style={[styles.mapBox, { borderRadius: radius.default, overflow: 'hidden' }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=80' }}
            style={styles.mapImage}
          />
          <View style={styles.mapOverlay} />
          <View style={[styles.deliveryPin, { backgroundColor: colors.secondary, borderRadius: radius.full }]}>
            <Text style={styles.deliveryPinEmoji}>🛵</Text>
          </View>
          <View style={[styles.mapBadge, { backgroundColor: colors.primary, borderRadius: radius.sm }]}>
            <Text style={[styles.mapBadgeText, { fontFamily: typography.fontFamilies.primaryBold }]}>
              Live Tracking
            </Text>
          </View>
        </View>

        {/* Timeline */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
          Order Status
        </Text>
        <View style={styles.timeline}>
          {STEPS.map((step, i) => {
            const active = isActive(step.key);
            const isCurrent = step.key === timelineStatus;
            return (
              <View key={step.key} style={styles.timelineRow}>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <View style={[styles.connector, {
                    backgroundColor: active ? colors.primary : colors.border,
                    opacity: active ? 1 : 0.4,
                  }]} />
                )}
                {/* Dot */}
                <Animated.View style={[
                  styles.dot,
                  {
                    backgroundColor: active ? colors.primary : colors.border,
                    transform: isCurrent ? [{ scale: pulseAnim }] : [{ scale: 1 }],
                    borderWidth: isCurrent ? 3 : 0,
                    borderColor: isCurrent ? colors.primary + '40' : 'transparent',
                  }
                ]}>
                  {active && <Text style={styles.dotEmoji}>{step.emoji}</Text>}
                </Animated.View>
                {/* Step text */}
                <View style={styles.stepText}>
                  <Text style={[styles.stepTitle, {
                    color: active ? colors.text : colors.mutedText,
                    fontFamily: active ? typography.fontFamilies.primaryBold : typography.fontFamilies.primary,
                  }]}>
                    {step.label}
                  </Text>
                  <Text style={[styles.stepSub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                    {active ? step.sub : 'Waiting...'}
                    {step.key === 'pending' && active ? ` • ${formattedDate}` : ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Chef Info */}
        <Card variant="outlined" style={styles.chefCard}>
          <View style={styles.chefRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80' }}
              style={[styles.chefAvatar, { borderRadius: radius.full }]}
            />
            <View style={styles.chefDetails}>
              <Text style={[styles.chefName, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
                {order.chef_name || 'Home Kitchen Chef'}
              </Text>
              <Text style={[styles.chefRating, { color: '#F59E0B', fontFamily: typography.fontFamilies.primaryBold }]}>
                ★ 4.9  •  Top Rated Chef
              </Text>
            </View>
            <Button
              title="Chat"
              variant="secondary"
              onPress={() => Alert.alert('Secure Chat', 'Opening secure channel with Chef...')}
              style={styles.chatBtn}
            />
          </View>
          <Divider />
          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              📦 Order
            </Text>
            <Text style={[styles.metaVal, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]}>
              #NDG-{order.id}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={[styles.metaKey, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              📍 Deliver to
            </Text>
            <Text style={[styles.metaVal, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold }]} numberOfLines={1}>
              {order.delivery_address || 'Home'}
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', left: 20, top: 18 },
  backText: { color: '#ffffff', fontSize: 15 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
  orderId: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  scroll: { paddingTop: 20, paddingBottom: 50 },
  etaCard: {
    alignItems: 'center',
    padding: 28,
    marginBottom: 20,
    borderRadius: 16,
  },
  etaLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 },
  etaTime: { fontSize: 52, fontWeight: '900', marginBottom: 8 },
  etaSub: { fontSize: 13, fontStyle: 'italic', textAlign: 'center' },
  deliveredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 18,
    gap: 14,
    marginBottom: 20,
  },
  deliveredEmoji: { fontSize: 32 },
  deliveredTitle: { fontSize: 18, fontWeight: '700' },
  deliveredSub: { fontSize: 13, marginTop: 4 },
  mapBox: {
    height: 190,
    marginBottom: 24,
    position: 'relative',
  },
  mapImage: { width: '100%', height: '100%', objectFit: 'cover' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.12)' },
  deliveryPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22,
    marginLeft: -22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  deliveryPinEmoji: { fontSize: 22 },
  mapBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  mapBadgeText: { color: '#ffffff', fontSize: 11 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  timeline: { marginBottom: 24, paddingLeft: 8 },
  timelineRow: { flexDirection: 'row', marginBottom: 28, alignItems: 'flex-start', position: 'relative' },
  connector: { position: 'absolute', left: 17, top: 38, width: 2, height: 28 },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    zIndex: 2,
  },
  dotEmoji: { fontSize: 16 },
  stepText: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 15 },
  stepSub: { fontSize: 12, marginTop: 3, lineHeight: 16 },
  chefCard: { padding: 16 },
  chefRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  chefAvatar: { width: 50, height: 50, objectFit: 'cover' },
  chefDetails: { flex: 1, marginLeft: 12 },
  chefName: { fontSize: 15, fontWeight: '700' },
  chefRating: { fontSize: 12, marginTop: 3 },
  chatBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  metaKey: { fontSize: 13 },
  metaVal: { fontSize: 13, maxWidth: '60%', textAlign: 'right' },
});
