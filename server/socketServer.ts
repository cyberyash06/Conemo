import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import matchmakingQueue from '../lib/matchmaking';
import connectDB from '../lib/db';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';
import { Report } from '../models/Report';
import { User } from '../models/User';
import rateLimit from '../middleware/rateLimiter';

const socketRateLimiter = rateLimit({
  interval: 1000, 
  uniqueTokenPerInterval: 500, // 500 active users
});

export const initSocketServer = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_queue', async ({ userId, username, mood }) => {
      try {
        await connectDB();
        
        // Check for active chat
        const activeChat = await Chat.findOne({
          users: userId,
          endedAt: { $exists: false },
          expiresAt: { $gt: new Date() }
        });

        if (activeChat) {
          const chatId = activeChat._id.toString();
          socket.join(chatId);
          
          const partnerId = activeChat.users.find(id => id.toString() !== userId);
          const partnerUser = await User.findById(partnerId);
          
          const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

          socket.emit('active_chat_restored', {
            chatId,
            partner: { 
              userId: partnerUser?._id.toString(), 
              username: partnerUser?.username || 'Partner' 
            },
            mood: activeChat.mood,
            messages
          });

          // Notify partner that they reconnected
          socket.to(chatId).emit('partner_reconnected');
          return;
        }

        console.log(`User ${username} (${userId}) joined queue for mood: ${mood}`);
        matchmakingQueue.addToQueue({
          userId,
          socketId: socket.id,
          username,
          mood,
          joinedAt: Date.now(),
        });
      } catch (err) {
        console.error('Error joining queue:', err);
      }
    });

    socket.on('send_message', async ({ chatId, senderId, text, replyTo }) => {
      try {
        // Limit to 5 messages per second per user
        await socketRateLimiter.check(5, socket.id);
      } catch {
        socket.emit('rate_limit_error', { message: 'You are sending messages too fast.' });
        return;
      }

      try {
        await connectDB();
        const newMessage = await Message.create({
          chatId,
          senderId,
          text,
          ...(replyTo ? { replyTo } : {})
        });

        io.to(chatId).emit('new_message', {
          _id: newMessage._id,
          chatId,
          senderId,
          text,
          timestamp: newMessage.timestamp,
          replyTo: newMessage.replyTo,
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    socket.on('typing', ({ chatId, isTyping }) => {
      socket.to(chatId).emit('partner_typing', { isTyping });
    });

    socket.on('skip_chat', async ({ chatId }) => {
      try {
        await connectDB();
        await Chat.findByIdAndUpdate(chatId, { endedAt: new Date() });
      } catch (err) {
        console.error('Error ending chat (skip):', err);
      }
      socket.to(chatId).emit('partner_skipped');
      socket.leave(chatId);
    });

    socket.on('leave_chat', async ({ chatId }) => {
      try {
        await connectDB();
        await Chat.findByIdAndUpdate(chatId, { endedAt: new Date() });
      } catch (err) {
        console.error('Error ending chat (leave):', err);
      }
      socket.to(chatId).emit('partner_disconnected');
      socket.leave(chatId);
    });

    socket.on('leave_queue', () => {
      console.log(`User left queue manually: ${socket.id}`);
      matchmakingQueue.removeFromQueue(socket.id);
    });

    socket.on('report_user', async ({ chatId, reportedUserId, reporterId, reason }) => {
      try {
        await connectDB();
        await Report.create({
          chatId,
          reportedUserId,
          reporterId,
          reason,
        });
      } catch (error) {
        console.error('Error creating report:', error);
      }
    });

    socket.on('disconnecting', () => {
      // Notify rooms before they are left
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.to(room).emit('partner_temporarily_disconnected');
        }
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      matchmakingQueue.removeFromQueue(socket.id);
    });
  });

  matchmakingQueue.on('match', async ({ user1, user2, mood }) => {
    try {
      await connectDB();
      
      // Create a new chat in DB
      const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hour TTL
      const newChat = await Chat.create({
        users: [user1.userId, user2.userId],
        mood,
        expiresAt,
      });

      const chatId = newChat._id.toString();

      // Notify users
      io.to(user1.socketId).emit('match_found', {
        chatId,
        partner: { userId: user2.userId, username: user2.username },
        mood,
      });
      io.to(user2.socketId).emit('match_found', {
        chatId,
        partner: { userId: user1.userId, username: user1.username },
        mood,
      });

      // Join sockets to room
      const socket1 = io.sockets.sockets.get(user1.socketId);
      const socket2 = io.sockets.sockets.get(user2.socketId);
      
      socket1?.join(chatId);
      socket2?.join(chatId);

      console.log(`Match found: ${user1.username} & ${user2.username} in chat ${chatId}`);
    } catch (error) {
      console.error('Error creating chat match:', error);
    }
  });

  return io;
};
