import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { ArrowLeft, Send } from 'lucide-react-native';
import apiClient from '../../config/api';
import socketService from '../../services/socket';
import { useAuthStore } from '../../store/store';
import { useTheme } from '../../theme';

export default function CustomerChatScreen({ route, navigation }) {
  const { chefId, chefName } = route.params;
  const { user } = useAuthStore();
  const { colors, spacing, radius, typography } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const currentUserId = user?.id;

  useEffect(() => {
    if (currentUserId) {
      socketService.connect(currentUserId);
      
      const handleNewMessage = (msg) => {
        if ((msg.sender_id === chefId && msg.receiver_id === currentUserId) ||
            (msg.sender_id === currentUserId && msg.receiver_id === chefId)) {
          setMessages(prev => [...prev, msg]);
        }
      };

      socketService.on('new_message', handleNewMessage);
      fetchMessages();

      return () => {
        socketService.off('new_message', handleNewMessage);
        // We do not disconnect here in case they use chat elsewhere, 
        // but for a strict 1-to-1 we could. Let's keep it connected.
      };
    }
  }, [currentUserId]);

  const fetchMessages = async () => {
    try {
      const res = await apiClient.get(`/api/chat/${chefId}`);
      setMessages(res.data.data || []);
      // Mark read
      await apiClient.put(`/api/chat/${chefId}/read`);
    } catch (err) {
      console.error('Fetch chat err', err);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    socketService.sendMessage(chefId, inputText.trim());
    setInputText('');
  };

  const renderMessage = ({ item }) => {
    const isMe = item.sender_id === currentUserId;
    return (
      <View style={[
        styles.messageBubble, 
        isMe ? styles.myMessage : styles.theirMessage,
        { backgroundColor: isMe ? colors.primary : colors.surfaceContainerLow, borderRadius: radius.lg }
      ]}>
        <Text style={[
          styles.messageText, 
          { 
            color: isMe ? '#ffffff' : colors.text,
            fontFamily: typography.fontFamilies.primary 
          }
        ]}>
          {item.content}
        </Text>
        <Text style={[
          styles.timestamp, 
          { 
            color: isMe ? 'rgba(255,255,255,0.7)' : colors.mutedText,
            fontFamily: typography.fontFamilies.primary 
          }
        ]}>
          {new Date(item.created_at || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
          Chat with Chef {chefName}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]}>
                Send a message to start chatting with Chef {chefName}.
              </Text>
            </View>
          }
        />

        <View style={[styles.inputContainer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
          <TextInput
            style={[
              styles.input, 
              { 
                backgroundColor: colors.surfaceContainerLow, 
                color: colors.text, 
                borderRadius: radius.full,
                fontFamily: typography.fontFamilies.primary
              }
            ]}
            placeholder="Type your message..."
            placeholderTextColor={colors.mutedText}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, { backgroundColor: inputText.trim() ? colors.primary : colors.mutedText, borderRadius: radius.full }]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Send color="#ffffff" size={18} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginBottom: 12,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginRight: 12,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
