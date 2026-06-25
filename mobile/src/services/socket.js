import { API_URL } from '../config/api';

class SocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // Determine the WS URL from the existing API base URL
    // In dev it's typically ws://localhost:5000 or similar
    // Assuming backend runs on 5000 as per express setup
    // You should dynamically get this based on process.env in production
    
    let wsUrl = API_URL.replace('http://', 'ws://').replace('https://', 'wss://');
    wsUrl = `${wsUrl}?userId=${userId}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'new_message') {
          const callbacks = this.listeners.get('new_message') || [];
          callbacks.forEach(cb => cb(data.payload));
        }
      } catch (err) {
        console.error('WS message error', err);
      }
    };

    this.ws.onerror = (e) => {
      console.log('WebSocket Error: ', e.message);
    };

    this.ws.onclose = (e) => {
      console.log('WebSocket Disconnected', e.code, e.reason);
      // Implement basic reconnection logic if needed
      setTimeout(() => {
        if (this.ws && this.ws.readyState === WebSocket.CLOSED) {
          this.connect(userId);
        }
      }, 3000);
    };
  }

  sendMessage(receiverId, content) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'send_message',
        payload: { receiverId, content }
      }));
    } else {
      console.warn('Cannot send message: WS not connected');
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
    this.listeners.set(event, callbacks);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const socketService = new SocketService();
export default socketService;
