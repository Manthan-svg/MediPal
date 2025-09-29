import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useWebSocket = (token) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        // Create socket connection
        const newSocket = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', {
            auth: {
                token: token
            },
            transports: ['websocket', 'polling']
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('WebSocket connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            setIsConnected(false);
        });

        // Notification event handlers
        newSocket.on('notification', (notification) => {
            console.log('New notification received:', notification);
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/favicon.ico',
                    tag: notification.id
                });
            }
        });

        newSocket.on('medication_confirmed', (data) => {
            console.log('Medication confirmation:', data);
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [token]);

    // Request notification permission
    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    };

    // Send medication taken confirmation
    const confirmMedicationTaken = (medicationData) => {
        if (socket && isConnected) {
            socket.emit('medication_taken', medicationData);
        }
    };

    // Acknowledge notification
    const acknowledgeNotification = (notificationId) => {
        if (socket && isConnected) {
            socket.emit('notification_acknowledged', { notificationId });
        }
    };

    // Update notification preferences
    const updateNotificationPreferences = (preferences) => {
        if (socket && isConnected) {
            socket.emit('update_notification_preferences', preferences);
        }
    };

    // Mark notification as read
    const markNotificationAsRead = (notificationId) => {
        setNotifications(prev => 
            prev.map(notif => 
                notif.id === notificationId 
                    ? { ...notif, read: true }
                    : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // Clear all notifications
    const clearNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    return {
        socket,
        isConnected,
        notifications,
        unreadCount,
        requestNotificationPermission,
        confirmMedicationTaken,
        acknowledgeNotification,
        updateNotificationPreferences,
        markNotificationAsRead,
        clearNotifications
    };
};

export default useWebSocket;
