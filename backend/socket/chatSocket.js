const Chat = require('../models/Chat');
const ChatbotService = require('../utils/chatbotService');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to chat:', socket.id);
    
    let userId = 0;
  
    // ✅ GIỮ NGUYÊN: Send notification event
    socket.on('send_notification', (data) => {
      const { userId, message } = data;
      if (userId) {
        const roomName = `user_${userId}`; 
        
        io.to(roomName).emit('new_notification', { 
          id: Date.now(), 
          message: message,
          is_read: false,
          created_at: new Date().toISOString()
        });
        
        console.log(`✅ Notification sent to room: ${roomName}`);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected from chat:', socket.id);
    });
  });

  // Helper function to send conversation history
  async function sendConversationHistory(socket, userId) {
    try {
      const conversation = await Chat.getConversationByUserId(userId);
      socket.emit('conversation_history', conversation || []);
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      socket.emit('conversation_history', []);
      socket.emit('error', {
        message: 'Không thể tải lịch sử trò chuyện. Vui lòng thử lại sau.'
      });
    }
  }
};