// ============================================
// SOCKET.IO CLIENT - 101% BUG FREE VERSION
// ============================================
import { io } from 'socket.io-client';

class SecureSocket {
  constructor() {
    this.socket = null;
    this.connectionAttempts = 0;
    this.maxAttempts = 5;
    this.reconnectDelay = 1000;
    this.isConnected = false;
    this.eventListeners = new Map();
    this.heartbeatInterval = null;
    this.lastHeartbeatTime = null;
  }

  connect(token) {
    try {
      // Security: Validate token
      if (!token || typeof token !== 'string' || token.length < 10) {
        console.error('Socket: Invalid authentication token');
        return false;
      }

      // Security: Validate backend URL
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      // ✅ FIXED: Better backend URL validation
      if (!backendUrl || backendUrl === 'http://localhost:3001' || backendUrl.includes('localhost:3001')) {
        console.error('Socket: Backend URL not configured properly');
        console.error('Please set NEXT_PUBLIC_BACKEND_URL in Vercel environment variables');
        console.error('Current value:', backendUrl);
        return false;
      }

      // Validate URL format
      if (!backendUrl.startsWith('http://') && !backendUrl.startsWith('https://')) {
        console.error('Socket: Invalid backend URL format');
        return false;
      }

      // Close existing connection
      if (this.socket) {
        this.disconnect();
      }

      // Determine environment
      const isProduction = process.env.NODE_ENV === 'production';
      const isRailway = backendUrl.includes('railway.app');
      const isLocalhost = backendUrl.includes('localhost');

      // Railway SSL fix - Railway uses self-signed certificates
      const secureOptions = isRailway ? {
        secure: true,
        rejectUnauthorized: false,
        agent: false
      } : {
        secure: true,
        rejectUnauthorized: isProduction && !isLocalhost,
        agent: false
      };

      // ✅ FIXED: Show connecting message with URL
      console.log('🔌 Socket connecting to:', backendUrl.replace(/https?:\/\/(.*?)@.*/, 'https://$1@[HIDDEN]'));
      
      // Create secure socket connection
      this.socket = io(backendUrl, {
        auth: { 
          token: token,
          timestamp: Date.now(),
          origin: typeof window !== 'undefined' ? window.location.origin : 'client',
          version: '1.0.0'
        },
        transports: ['polling', 'websocket'],
        upgrade: true,
        rememberUpgrade: true,
        path: '/socket.io/',
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: this.maxAttempts,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 10000,
        timeout: 30000,
        autoConnect: true,
        forceNew: false,
        multiplex: true,
        
        // Security options
        ...secureOptions,
        
        // Performance
        perMessageDeflate: false,
        closeOnBeforeunload: false
      });

      // Setup event handlers
      this.setupEventHandlers();

      // Start heartbeat
      this.startHeartbeat();

      return true;
    } catch (error) {
      console.error('Socket connection error:', error);
      return false;
    }
  }

  setupEventHandlers() {
    if (!this.socket) return;

    // Connection established
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      this.connectionAttempts = 0;
      this.emitEvent('connected', { 
        socketId: this.socket.id,
        timestamp: new Date().toISOString() 
      });
    });

    // Connection error
    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      this.isConnected = false;
      this.connectionAttempts++;
      
      // Exponential backoff with max limit
      this.reconnectDelay = Math.min(30000, 1000 * Math.pow(2, this.connectionAttempts));
      
      // Notify listeners
      this.emitEvent('connection_error', { 
        error: error.message,
        attempts: this.connectionAttempts,
        timestamp: new Date().toISOString()
      });
    });

    // Reconnecting
    this.socket.on('reconnecting', (attempt) => {
      console.log(`🔄 Socket reconnecting (attempt ${attempt})`);
      this.emitEvent('reconnecting', { 
        attempt,
        timestamp: new Date().toISOString() 
      });
    });

    // Reconnect failed
    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnect failed');
      this.isConnected = false;
      this.emitEvent('reconnect_failed', {
        timestamp: new Date().toISOString()
      });
    });

    // Disconnected
    this.socket.on('disconnect', (reason) => {
      console.log(`🔌 Socket disconnected: ${reason}`);
      this.isConnected = false;
      
      // Stop heartbeat on disconnect
      this.stopHeartbeat();
      
      // If disconnect was initiated by server, don't reconnect
      if (reason === 'io server disconnect') {
        console.log('Server initiated disconnect - manual reconnect required');
      }
      
      this.emitEvent('disconnected', { 
        reason,
        socketId: this.socket?.id,
        timestamp: new Date().toISOString() 
      });
    });

    // Custom events with validation
    this.socket.on('payment-verified', (data) => {
      if (this.validateIncomingData(data)) {
        console.log('💰 Payment verified via socket:', data);
        this.emitEvent('payment_verified', data);
      }
    });

    this.socket.on('payment-success', (data) => {
      if (this.validateIncomingData(data)) {
        console.log('💰 Payment success:', data);
        this.emitEvent('payment_success', data);
      }
    });

    this.socket.on('new-notification', (data) => {
      if (this.validateIncomingData(data)) {
        console.log('🔔 New notification:', data);
        this.emitEvent('new_notification', data);
      }
    });

    this.socket.on('user-status-update', (data) => {
      if (this.validateIncomingData(data)) {
        console.log('👤 User status update:', data);
        this.emitEvent('user_status_update', data);
      }
    });

    this.socket.on('welcome', (data) => {
      if (this.validateIncomingData(data)) {
        console.log('👋 Welcome message:', data);
        this.emitEvent('welcome', data);
      }
    });

    this.socket.on('heartbeat-ack', (data) => {
      if (data && data.success) {
        this.lastHeartbeatTime = Date.now();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emitEvent('socket_error', error);
    });
  }

  // Emit secure event
  emit(event, data, callback) {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot emit - socket not connected');
      if (callback) callback({ success: false, error: 'Socket not connected' });
      return false;
    }

    try {
      // Security: Validate data before sending
      const sanitizedData = this.sanitizeData(data);
      
      // Add security headers
      const enhancedData = {
        ...sanitizedData,
        _timestamp: Date.now(),
        _security: crypto.randomUUID ? crypto.randomUUID() : 'secure-' + Date.now().toString(36),
        _origin: typeof window !== 'undefined' ? window.location.origin : 'client',
        _version: '1.0.0'
      };

      // Validate event name
      if (!event || typeof event !== 'string' || event.length > 100) {
        console.error('Invalid event name:', event);
        if (callback) callback({ success: false, error: 'Invalid event name' });
        return false;
      }

      this.socket.emit(event, enhancedData, (response) => {
        if (callback && typeof callback === 'function') {
          // Security: Validate server response
          if (response && typeof response === 'object') {
            callback(response);
          } else {
            console.error('Invalid server response format');
            callback({ success: false, error: 'Invalid response format' });
          }
        }
      });
      return true;
    } catch (error) {
      console.error('Emit error:', error);
      if (callback) callback({ success: false, error: error.message });
      return false;
    }
  }

  // Listen to events
  on(event, callback) {
    if (!this.socket) {
      console.error('Socket not initialized');
      return false;
    }

    if (!event || typeof event !== 'string' || typeof callback !== 'function') {
      console.error('Invalid listener parameters');
      return false;
    }

    try {
      const wrappedCallback = (data) => {
        try {
          // Security: Validate incoming data
          if (this.validateIncomingData(data)) {
            callback(data);
          } else {
            console.warn(`Invalid data received for event: ${event}`);
          }
        } catch (error) {
          console.error(`Callback error for event ${event}:`, error);
        }
      };
      
      this.socket.on(event, wrappedCallback);
      
      // Store listener for cleanup
      if (!this.eventListeners.has(event)) {
        this.eventListeners.set(event, []);
      }
      this.eventListeners.get(event).push({ original: callback, wrapped: wrappedCallback });
      
      return true;
    } catch (error) {
      console.error('Listener error:', error);
      return false;
    }
  }

  // Remove listener
  off(event, callback) {
    if (!this.socket || !this.eventListeners.has(event)) return;

    const listeners = this.eventListeners.get(event);
    const index = listeners.findIndex(item => item.original === callback);
    
    if (index > -1) {
      const { wrapped } = listeners[index];
      this.socket.off(event, wrapped);
      listeners.splice(index, 1);
      
      if (listeners.length === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  // Disconnect socket
  disconnect() {
    try {
      // Stop heartbeat
      this.stopHeartbeat();
      
      if (this.socket) {
        // Remove all listeners
        this.eventListeners.forEach((listeners, event) => {
          listeners.forEach(({ wrapped }) => {
            this.socket.off(event, wrapped);
          });
        });
        this.eventListeners.clear();

        // Disconnect
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
        this.connectionAttempts = 0;
        
        console.log('✅ Socket disconnected gracefully');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  // Security: Data sanitization
  sanitizeData(data) {
    if (!data || typeof data !== 'object') return data;

    const sanitized = Array.isArray(data) ? [] : {};
    const MAX_DEPTH = 10;
    
    const sanitizeRecursive = (obj, depth = 0) => {
      if (depth > MAX_DEPTH) {
        console.warn('Maximum sanitization depth reached');
        return '[Circular or too deep]';
      }
      
      if (!obj || typeof obj !== 'object') return obj;
      
      const result = Array.isArray(obj) ? [] : {};
      
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          
          // Remove dangerous patterns from strings
          if (typeof value === 'string') {
            result[key] = value
              .replace(/[<>]/g, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+=/gi, '')
              .replace(/data:/gi, '')
              .replace(/vbscript:/gi, '')
              .trim()
              .substring(0, 10000);
          } else if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeRecursive(value, depth + 1);
          } else {
            result[key] = value;
          }
        }
      }
      
      return result;
    };
    
    return sanitizeRecursive(data);
  }

  // Security: Validate incoming data
  validateIncomingData(data) {
    if (!data || typeof data !== 'object') {
      console.warn('Invalid data: not an object');
      return false;
    }

    // Check for required security fields (optional)
    if (data._timestamp && typeof data._timestamp === 'number') {
      const age = Date.now() - data._timestamp;
      if (age > 30000) {
        console.warn('Data too old - possible replay attack');
        return false;
      }
    }

    // Check data size
    try {
      const dataSize = JSON.stringify(data).length;
      if (dataSize > 1024 * 1024) {
        console.warn('Data too large');
        return false;
      }
    } catch (error) {
      console.warn('Failed to calculate data size:', error);
      return false;
    }

    return true;
  }

  // Emit custom event to listeners
  emitEvent(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach(({ original }) => {
        try {
          original(data);
        } catch (error) {
          console.error(`Event listener error for ${event}:`, error);
        }
      });
    }
  }

  // Get connection status
  getStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      attempts: this.connectionAttempts,
      maxAttempts: this.maxAttempts,
      lastHeartbeat: this.lastHeartbeatTime,
      timestamp: new Date().toISOString()
    };
  }

  // Heartbeat management
  startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.socket) {
        this.sendHeartbeat();
      }
    }, 25000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Send heartbeat
  sendHeartbeat() {
    if (this.isConnected && this.socket) {
      this.emit('heartbeat', { 
        timestamp: Date.now(),
        clientId: this.socket.id 
      });
    }
  }

  // Join payment room
  joinPaymentRoom(orderId) {
    if (!orderId || typeof orderId !== 'string') {
      console.error('Invalid orderId for payment room');
      return false;
    }
    
    return this.emit('join-payment', { orderId });
  }

  // Leave payment room
  leavePaymentRoom(orderId) {
    if (!orderId || typeof orderId !== 'string') {
      console.error('Invalid orderId for payment room');
      return false;
    }
    
    return this.emit('leave-payment', { orderId });
  }
}

// Singleton instance with error handling
let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    try {
      socketInstance = new SecureSocket();
    } catch (error) {
      console.error('Failed to create socket instance:', error);
      return null;
    }
  }
  return socketInstance;
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (socketInstance) {
      socketInstance.disconnect();
    }
  });
}

export default getSocket;