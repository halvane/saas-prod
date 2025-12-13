import React, { useState } from 'react';
import { Bell, Check, X, Trash2, CheckCheck } from 'lucide-react';
import { Badge } from './Badge';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'error';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Post Published Successfully',
    message: 'Your Instagram carousel "Fashion Trends 2025" went live',
    time: '5 min ago',
    type: 'success',
    read: false
  },
  {
    id: '2',
    title: 'Analytics Ready',
    message: 'Weekly performance report is now available',
    time: '1 hour ago',
    type: 'info',
    read: false
  },
  {
    id: '3',
    title: 'API Limit Warning',
    message: 'You\'ve used 450/500 posts this month',
    time: '3 hours ago',
    type: 'warning',
    read: true
  },
  {
    id: '4',
    title: 'New Feature Available',
    message: 'Try our new AI-powered hashtag generator',
    time: '1 day ago',
    type: 'info',
    read: true
  }
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'info': return '#3B82F6';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✓';
      case 'info': return 'ℹ';
      case 'warning': return '⚠';
      case 'error': return '✕';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
      >
        <Bell className="w-5 h-5 text-[#6B7280]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] z-50 animate-fadeIn">
            {/* Header */}
            <div className="p-4 border-b border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[#1F2937]">Notifications</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-[#F3F4F6] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>
              
              {notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] font-medium transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Mark all as read
                  </button>
                  <span className="text-[#E5E7EB]">•</span>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-[#EF4444] hover:text-[#DC2626] font-medium transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                    <Bell className="w-8 h-8 text-[#9CA3AF]" />
                  </div>
                  <p className="text-sm text-[#6B7280]">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E7EB]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[#F9FAFB] transition-colors ${
                        !notification.read ? 'bg-[#F3F4F6]' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Type Icon */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                          style={{ backgroundColor: getTypeColor(notification.type) }}
                        >
                          {getTypeIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium text-[#1F2937] text-sm">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-[#8B5CF6] rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-[#6B7280] mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#9CA3AF]">
                              {notification.time}
                            </span>
                            <div className="flex items-center gap-2">
                              {!notification.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] font-medium transition-colors"
                                >
                                  Mark as read
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(notification.id)}
                                className="p-1 hover:bg-[#FEE2E2] rounded transition-colors"
                              >
                                <Trash2 className="w-3 h-3 text-[#EF4444]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-[#E5E7EB] text-center">
                <button className="text-sm text-[#8B5CF6] hover:text-[#7C3AED] font-medium transition-colors">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
