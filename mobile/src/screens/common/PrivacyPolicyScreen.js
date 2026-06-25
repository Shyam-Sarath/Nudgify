import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { useTheme } from '../../theme';

export default function PrivacyPolicyScreen({ navigation }) {
  const { colors, spacing, radius, typography } = useTheme();

  const sections = [
    {
      title: 'Introduction',
      content: 'Welcome to Nudgify. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our app and tell you about your privacy rights.',
    },
    {
      title: 'Information Collected',
      content: 'We may collect, use, store and transfer different kinds of personal data about you including Identity Data, Contact Data, Financial Data, and Transaction Data.',
    },
    {
      title: 'How Data Is Used',
      content: 'We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to perform the contract we are about to enter into or have entered into with you, or where it is necessary for our legitimate interests.',
    },
    {
      title: 'Sharing Information',
      content: 'We may have to share your personal data with internal third parties, external third parties (such as service providers acting as processors), and third parties to whom we may choose to sell, transfer, or merge parts of our business or our assets.',
    },
    {
      title: 'Security',
      content: 'We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.',
    },
    {
      title: 'User Rights',
      content: 'Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.',
    },
    {
      title: 'Contact',
      content: 'If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@nudgify.com.',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
          Privacy Policy
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: colors.secondaryContainer }]}>
            <Shield color={colors.onSecondaryContainer} size={48} />
          </View>
          <Text style={[styles.lastUpdated, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
            Last Updated: June 25, 2026
          </Text>
        </View>

        {sections.map((section, index) => (
          <View 
            key={index} 
            style={[
              styles.card, 
              { 
                backgroundColor: colors.surface, 
                borderColor: colors.border,
                borderRadius: radius.lg 
              }
            ]}
          >
            <Text style={[styles.cardTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
              {section.title}
            </Text>
            <Text style={[styles.cardContent, { color: colors.text, fontFamily: typography.fontFamilies.primary }]}>
              {section.content}
            </Text>
          </View>
        ))}
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  lastUpdated: { fontSize: 14 },
  card: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 15,
    lineHeight: 24,
  },
});
