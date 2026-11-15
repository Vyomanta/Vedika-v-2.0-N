'use client';
import * as featureStyleFunctions from '@/features/administration/styles/View.06e0ec0c.styles.js';

import inlineStyles from '@/features/administration/styles/admin-alerts-page.jsx.styles.js';


import { useState, useEffect } from 'react';
import { Bell, MailOpen, Trash2, GraduationCap, CheckSquare, FileText, Terminal, CheckCircle2 } from 'lucide-react';
import { T } from '@/shared/design-system/theme';
import { useMediaQuery, isMobileMQ } from '@/lib/useMediaQuery';
import { getNotifications, markNotificationRead, clearAllNotifications } from '@/features/administration/api/collections';

export default function AdminAlertsPage() {
  const isMobile = useMediaQuery(isMobileMQ);
  const [notifications, setNotifications] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadNotifications = () => {
    setLoading(true);
    getNotifications().then(data => {
      setNotifications(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    const success = await markNotificationRead(id);
    if (success) {
      loadNotifications();
    }
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to mark all notifications as read?')) {
      const success = await clearAllNotifications();
      if (success) {
        loadNotifications();
      }
    }
  };

  // Filter list
  const filteredAlerts = notifications.filter(alert => {
    return selectedCategory === 'All' || alert.category === selectedCategory;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const categories = ['All', 'Enrollment', 'Assignment', 'Quiz', 'System'];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Enrollment': return <GraduationCap size={15} color={T.purple} />;
      case 'Assignment': return <FileText size={15} color={T.accent} />;
      case 'Quiz': return <CheckSquare size={15} color={T.green} />;
      default: return <Terminal size={15} color={T.muted} />;
    }
  };

  const containerPadding = isMobile ? '70px 16px 32px 16px' : '40px';

  return (
    <div style={featureStyleFunctions.s0({containerPadding})}>
      {/* Header */}
      <div style={inlineStyles.s0}>
        <div>
          <h1 style={featureStyleFunctions.s1({T,isMobile})}>Notifications</h1>
          <p style={featureStyleFunctions.s2({T})}>Monitor student enrollments, assignment submissions, quiz results, and alerts.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleClearAll}
            style={featureStyleFunctions.s3({T})}
            onMouseEnter={(e) => e.currentTarget.style.background = `${T.purple}10`}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <MailOpen size={15} /> Mark all read
          </button>
        )}
      </div>

      {/* Tabs / Filter Panel */}
      <div style={inlineStyles.s1}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={featureStyleFunctions.s4({isSelected,T})}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Notifications Container */}
      {loading ? (
        <div style={inlineStyles.s2}>
          <div style={featureStyleFunctions.s5({T})} />
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div style={featureStyleFunctions.s6({T})}>
          <Bell size={48} color={T.muted} style={inlineStyles.s3} />
          <h3 style={featureStyleFunctions.s7({T})}>No notifications</h3>
          <p style={featureStyleFunctions.s8({T})}>
            You have no notifications in category "{selectedCategory}" at this time.
          </p>
        </div>
      ) : (
        <div style={inlineStyles.s4}>
          {filteredAlerts.map((alert) => {
            const isUnread = !alert.read;
            return (
              <div
                key={alert.id}
                style={featureStyleFunctions.s9({isUnread,T})}
              >
                <div style={inlineStyles.s5}>
                  {/* Category Indicator Icon */}
                  <div style={featureStyleFunctions.s10({isUnread,T})}>
                    {getCategoryIcon(alert.category)}
                  </div>

                  {/* Body Content */}
                  <div>
                    <div style={inlineStyles.s6}>
                      <span style={featureStyleFunctions.s11({T})}>
                        {alert.title}
                      </span>
                      {isUnread && (
                        <span style={featureStyleFunctions.s12({T})} />
                      )}
                    </div>
                    <p style={featureStyleFunctions.s13({T})}>
                      {alert.message}
                    </p>
                    <span style={featureStyleFunctions.s14({T})}>
                      {alert.date}
                    </span>
                  </div>
                </div>

                {/* Mark as read checkbox or action */}
                {isUnread && (
                  <button
                    onClick={() => handleMarkRead(alert.id)}
                    style={featureStyleFunctions.s15({T})}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = T.purple;
                      e.currentTarget.style.background = `${T.purple}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = T.muted;
                      e.currentTarget.style.background = 'transparent';
                    }}
                    title="Mark as read"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
