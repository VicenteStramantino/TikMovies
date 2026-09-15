
export type Notification = {
  id: number
  message: string
  type: 'success' | 'favorite' | 'watchlist'
}

type NotificationProps = {
  notifications: Notification[]
}

function NotificationContainer({ notifications }: NotificationProps) {
  return (
    <div className="notification-container" aria-live="polite" aria-atomic="true">
      {notifications.map((notification) => (
        <div className={`notification ${notification.type}`} role="status" key={notification.id}>
          {notification.message}
        </div>
      ))}
    </div>
  )
}

export default NotificationContainer
