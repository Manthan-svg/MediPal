import React, { useState, useEffect } from 'react';
import { FaBell, FaTimes, FaCheck, FaTrash, FaCog } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useWebSocket from '../hooks/useWebSocket';
import { toast } from 'react-toastify';

const NotificationCenter = ({ token }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const {
        isConnected,
        notifications: wsNotifications,
        unreadCount: wsUnreadCount,
        requestNotificationPermission,
        confirmMedicationTaken,
        acknowledgeNotification,
        markNotificationAsRead,
        clearNotifications
    } = useWebSocket(token);

    // Sync WebSocket notifications with local state
    useEffect(() => {
        setNotifications(wsNotifications);
        setUnreadCount(wsUnreadCount);
    }, [wsNotifications, wsUnreadCount]);

    // Request notification permission on mount
    useEffect(() => {
        requestNotificationPermission();
    }, [requestNotificationPermission]);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/notifications/history`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications');
        } finally {
            setIsLoading(false);
        }
    };

    // Mark notification as read
    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                markNotificationAsRead(notificationId);
                toast.success('Notification marked as read');
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    // Mark all notifications as read
    const handleMarkAllAsRead = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/notifications/read-all`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
                setUnreadCount(0);
                toast.success('All notifications marked as read');
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            toast.error('Failed to mark all notifications as read');
        }
    };

    // Delete notification
    const handleDeleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
                toast.success('Notification deleted');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    // Handle medication taken confirmation
    const handleMedicationTaken = (medicationData) => {
        confirmMedicationTaken(medicationData);
        toast.success('Medication marked as taken');
    };

    // Get notification icon based on type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'medication_reminder':
                return '💊';
            case 'medication_missed':
                return '⚠️';
            case 'goal_achieved':
                return '🎉';
            default:
                return '🔔';
        }
    };

    // Get notification color based on priority
    const getNotificationColor = (priority) => {
        switch (priority) {
            case 'urgent':
                return 'border-red-500 bg-red-50';
            case 'high':
                return 'border-orange-500 bg-orange-50';
            case 'medium':
                return 'border-blue-500 bg-blue-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <FaBell className="text-xl text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
                {!isConnected && (
                    <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-3 w-3"></span>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="ml-2 text-sm text-red-500">
                                        ({unreadCount} unread)
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500">
                                    Loading notifications...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No notifications yet
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <motion.div
                                        key={notification._id || notification.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                            !notification.read ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="text-2xl">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                                        {notification.title}
                                                    </h4>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getNotificationColor(notification.priority)}`}>
                                                        {notification.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(notification.createdAt || notification.timestamp).toLocaleString()}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        {!notification.read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification._id || notification.id)}
                                                                className="text-xs text-blue-600 hover:text-blue-800"
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                        )}
                                                        {notification.type === 'medication_reminder' && (
                                                            <button
                                                                onClick={() => handleMedicationTaken(notification.data)}
                                                                className="text-xs text-green-600 hover:text-green-800"
                                                            >
                                                                Mark as taken
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteNotification(notification._id || notification.id)}
                                                            className="text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </span>
                                <button
                                    onClick={fetchNotifications}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
