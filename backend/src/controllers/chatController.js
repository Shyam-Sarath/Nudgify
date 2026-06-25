const supabase = require('../config/database');
const { AppError } = require('../middleware/errorHandler');

// Get all recent conversations for the current user (Chef or Customer)
const getConversations = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role; // 'customer' or 'chef'

  // Because Supabase REST doesn't easily support complex GROUP BY for latest messages in a viewless setup
  // without RPC, we fetch all messages where user is sender or receiver, then group in Node.
  // In a strict production environment, an RPC function or a view is much better.
  const { data, error } = await supabase
    .from('messages')
    .select('*, sender:users!sender_id(id, name, profile_image), receiver:users!receiver_id(id, name, profile_image)')
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === '42P01') {
      return res.status(200).json({ success: true, data: [] });
    }
    throw new AppError(error.message, 500);
  }

  // Group by the *other* user ID
  const conversationsMap = new Map();
  
  for (const msg of data) {
    const isSender = msg.sender_id === userId;
    const otherUser = isSender ? msg.receiver : msg.sender;
    const otherId = otherUser.id;

    if (!conversationsMap.has(otherId)) {
      conversationsMap.set(otherId, {
        otherUser,
        lastMessage: msg.content,
        lastMessageTime: msg.created_at,
        unreadCount: 0,
      });
    }

    if (!isSender && !msg.is_read) {
      conversationsMap.get(otherId).unreadCount++;
    }
  }

  const conversations = Array.from(conversationsMap.values());

  res.status(200).json({ success: true, data: conversations });
};

// Get messages for a specific conversation
const getMessages = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });

  if (error) {
    if (error.code === '42P01') {
      return res.status(200).json({ success: true, data: [] });
    }
    throw new AppError(error.message, 500);
  }

  res.status(200).json({ success: true, data: data || [] });
};

// Mark messages from another user as read
const markAsRead = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', userId)
    .eq('is_read', false);

  if (error && error.code !== '42P01') {
    throw new AppError(error.message, 500);
  }

  res.status(200).json({ success: true, message: 'Messages marked as read' });
};

module.exports = {
  getConversations,
  getMessages,
  markAsRead,
};
