import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, SafeAreaView, Pressable, Alert } from 'react-native';
import { useTheme } from '../../theme';
import { Card, Button, Divider } from '../../components';

export default function OrderTrackingScreen({ route, navigation }) {
  const { order } = route.params;
  const { colors, spacing, radius, typography } = useTheme();

  const [countdown, setCountdown] = useState('12:45');
  const [timelineStatus, setTimelineStatus] = useState(order.status?.toLowerCase() || 'pending');

  // Periodically check/poll status in real life, but for prototype we display countdown
  useEffect(() => {
    let min = 12;
    let sec = 45;
    const interval = setInterval(() => {
      if (sec === 0) {
        if (min === 0) {
          clearInterval(interval);
          return;
        }
        min--;
        sec = 59;
      } else {
        sec--;
      }
      setCountdown(`${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusText = () => {
    switch (timelineStatus) {
      case 'ready':
        return 'Your meal is ready for pickup/delivery!';
      case 'completed':
      case 'delivered':
        return 'Delivered! Enjoy your homemade meal.';
      case 'preparing':
        return 'Chef is preparing your order.';
      case 'pending':
      default:
        return 'Waiting for Chef to accept order.';
    }
  };

  const isStepActive = (step) => {
    const statusOrder = ['pending', 'preparing', 'ready', 'delivered'];
    const currentIdx = statusOrder.indexOf(timelineStatus);
    const stepIdx = statusOrder.indexOf(step);
    return stepIdx <= currentIdx;
  };

  const formattedDate = new Date(order.created_at || new Date()).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingHorizontal: spacing.containerPaddingMobile, borderBottomColor: colors.border + '50' }]}>
        <Pressable onPress={() => navigation.navigate('Home')}>
          <Text style={{ fontSize: 18, color: colors.primary }}>← Home</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Track Order
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Estimated Arrival Countdown */}
        <Card variant="flat" style={styles.countdownCard}>
          <Text style={[styles.countdownLabel, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Estimated Arrival
          </Text>
          <Text style={[styles.countdownValue, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            {countdown}
          </Text>
          <Text style={[styles.countdownSub, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            {getStatusText()}
          </Text>
        </Card>

        {/* Map View Placeholder */}
        <View style={[styles.mapContainer, { borderRadius: radius.default }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80' }}
            style={styles.mapImage}
          />
          <View style={styles.mapGradient} />
          
          <View style={[styles.deliveryMarker, { backgroundColor: colors.secondary, borderRadius: radius.full }]}>
            <Text style={{ fontSize: 20, color: '#ffffff' }}>🛵</Text>
          </View>
        </View>

        {/* Timeline Status */}
        <View style={styles.timelineSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            Order Status
          </Text>
          
          <View style={styles.timelineContainer}>
            {/* Timeline Line */}
            <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />

            {/* Step: Ordered */}
            <View style={styles.timelineStep}>
              <View style={[
                styles.timelineDot,
                { backgroundColor: isStepActive('pending') ? colors.primary : colors.border }
              ]}>
                {isStepActive('pending') && <Text style={styles.checkText}>✓</Text>}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isStepActive('pending') ? colors.text : colors.mutedText, fontFamily: typography.fontFamilies.primaryBold }]}>
                  Ordered
                </Text>
                <Text style={[styles.stepSub, { color: colors.mutedText }]}>
                  {formattedDate} • We've received your order
                </Text>
              </View>
            </View>

            {/* Step: Preparing */}
            <View style={styles.timelineStep}>
              <View style={[
                styles.timelineDot,
                { backgroundColor: isStepActive('preparing') ? colors.primary : colors.border }
              ]}>
                {isStepActive('preparing') && <Text style={styles.checkText}>🍳</Text>}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isStepActive('preparing') ? colors.text : colors.mutedText, fontFamily: typography.fontFamilies.primaryBold }]}>
                  Preparing
                </Text>
                <Text style={[styles.stepSub, { color: colors.mutedText }]}>
                  Chef is cooking your fresh meal
                </Text>
              </View>
            </View>

            {/* Step: Out for Delivery */}
            <View style={styles.timelineStep}>
              <View style={[
                styles.timelineDot,
                { backgroundColor: isStepActive('ready') ? colors.primary : colors.border }
              ]}>
                {isStepActive('ready') && <Text style={styles.checkText}>✓</Text>}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isStepActive('ready') ? colors.text : colors.mutedText, fontFamily: typography.fontFamilies.primaryBold }]}>
                  Out for Delivery / Ready
                </Text>
                <Text style={[styles.stepSub, { color: colors.mutedText }]}>
                  Heading to your location
                </Text>
              </View>
            </View>

            {/* Step: Delivered */}
            <View style={styles.timelineStep}>
              <View style={[
                styles.timelineDot,
                { backgroundColor: isStepActive('delivered') ? colors.primary : colors.border }
              ]}>
                {isStepActive('delivered') && <Text style={styles.checkText}>✓</Text>}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: isStepActive('delivered') ? colors.text : colors.mutedText, fontFamily: typography.fontFamilies.primaryBold }]}>
                  Delivered
                </Text>
                <Text style={[styles.stepSub, { color: colors.mutedText }]}>
                  Enjoy your food!
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chef contact info */}
        <Card variant="outlined" style={styles.chefCard}>
          <View style={styles.chefRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=150&q=80' }}
              style={[styles.chefAvatar, { borderRadius: radius.full }]}
            />
            <View style={styles.chefInfo}>
              <Text style={[styles.chefName, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
                Kitchen Chef
              </Text>
              <Text style={[styles.chefRating, { color: colors.secondary, fontFamily: typography.fontFamilies.primaryBold }]}>
                ★ 4.9 • Top Rated
              </Text>
            </View>
            <Button
              title="Contact"
              onPress={() => Alert.alert('Secure Message', 'Opening secure chat with Chef...')}
              variant="secondary"
              style={styles.contactBtn}
            />
          </View>
          <Divider />
          <View style={styles.orderMeta}>
            <Text style={{ color: colors.mutedText, fontSize: 12 }}>Order #NDG-{order.id}</Text>
            <Text style={{ color: colors.mutedText, fontSize: 12 }}>Address: {order.delivery_address || 'Home'}</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
  },
  countdownCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  countdownLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  countdownValue: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 8,
  },
  countdownSub: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  mapContainer: {
    height: 200,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  mapGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(51, 69, 55, 0.1)',
  },
  deliveryMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 8,
  },
  timelineLine: {
    position: 'absolute',
    left: 20,
    top: 10,
    bottom: 20,
    width: 2,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stepContent: {
    marginLeft: 16,
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
  },
  stepSub: {
    fontSize: 12,
    marginTop: 2,
  },
  chefCard: {
    padding: 16,
  },
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chefAvatar: {
    width: 48,
    height: 48,
    objectFit: 'cover',
  },
  chefInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chefName: {
    fontSize: 16,
    fontWeight: '700',
  },
  chefRating: {
    fontSize: 12,
    marginTop: 2,
  },
  contactBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
