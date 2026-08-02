import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  createdAt: string
}

interface NotificationContextValue {
  notifications: Notification[]
  isOpen: boolean
  showNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  dismissNotification: (id: string) => void
  toggleNotifications: () => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

function createId() {
  return `notif-${Math.random().toString(36).slice(2, 10)}`
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const showNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const nextNotification: Notification = {
      id: createId(),
      createdAt: new Date().toISOString(),
      ...notification
    }
    setNotifications((current) => [nextNotification, ...current].slice(0, 5))
    setIsOpen(true)
  }

  const dismissNotification = (id: string) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id))
  }

  const toggleNotifications = () => {
    setIsOpen((current) => !current)
  }

  useEffect(() => {
    const timers = notifications.map((notification) =>
      window.setTimeout(() => dismissNotification(notification.id), 6000)
    )

    return () => {
      timers.forEach(window.clearTimeout)
    }
  }, [notifications])

  const value = useMemo(
    () => ({ notifications, isOpen, showNotification, dismissNotification, toggleNotifications }),
    [notifications, isOpen]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <aside className="notification-center" aria-live="polite">
        <button type="button" className="notification-bell" onClick={toggleNotifications} aria-label="Toggle notifications">
          <span aria-hidden="true">🔔</span>
          {notifications.length > 0 ? <span className="notification-count">{notifications.length}</span> : null}
        </button>

        {isOpen ? (
          <div className="notification-panel" role="region" aria-label="Notification center">
            <div className="notification-panel-header">
              <span>Notifications</span>
              <button type="button" className="notification-clear" onClick={() => setNotifications([])}>
                Clear all
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="notification-empty">No alerts at this time.</div>
            ) : (
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`notification-toast notification-${notification.type}`}>
                    <div className="notification-content">
                      <strong>{notification.title}</strong>
                      <p>{notification.message}</p>
                    </div>
                    <button
                      type="button"
                      className="notification-close"
                      onClick={() => dismissNotification(notification.id)}
                      aria-label="Dismiss notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </aside>
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
