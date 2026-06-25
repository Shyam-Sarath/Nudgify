import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, MessageSquare } from 'lucide-react-native';
import apiClient from '../../config/api';
import { useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';

export default function ChefChatListScreen({ navigation }) {
  const { user } = useAuthStore();
  const { colors, spacing, radius, typography } = useTheme();
  const [conversations, setConversations] = React.useState([]);

  React.useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await apiClient.get('/api/chat/conversations');
        setConversations(res.data.data || []);
      } catch (err) {
        console.error('Fetch conversations err:', err);
      }
    };
    fetchConversations();
  }, []);

  const renderChatItem = ({ item }) => {
    const customerId = item.otherUser.id;
    const customerName = item.otherUser.name || `Customer ${customerId}`;
    const lastMessage = item.lastMessage;
    const unreadCount = item.unreadCount || 0;

    return (
      <TouchableOpacity 
        style={[styles.chatItem, { borderBottomColor: colors.border }]}
        onPress={() => navigation.navigate('ChefChat', { customerId, customerName: 'Customer ' + customerId })}
      >
        <View style={[styles.avatar, { backgroundColor: colors.secondaryContainer }]}>
          <MessageSquare color={colors.onSecondaryContainer} size={20} />
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[styles.customerName, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
              {customerName}
            </Text>
            {item.lastMessageTime && (
              <Text style={[styles.timeText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                {new Date(item.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>
          <View style={styles.chatFooter}>
            <Text 
              style={[styles.lastMessage, { color: unreadCount > 0 ? colors.text : colors.mutedText, fontFamily: typography.fontFamilies.primary }]}
              numberOfLines={1}
            >
              {lastMessage ? lastMessage : 'No messages yet'}
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
          Customer Chats
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={conversations}
        keyExtractor={(item) => String(item.otherUser.id)}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MessageSquare color={colors.mutedText} size={48} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
              No customer chats yet.
            </Text>
          </View>
        }
      />
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
  listContainer: { paddingBottom: 24 },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  chatInfo: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: { fontSize: 16, fontWeight: '600' },
  timeText: { fontSize: 12 },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: { flex: 1, fontSize: 14, marginRight: 8 },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: { fontSize: 16 },
});
