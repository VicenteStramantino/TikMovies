import './Toast.css'

export type Toast = {
  id: number
  message: string
  type: 'success' | 'favorite'
}

type ToastProps = {
  toasts: Toast[]
}

function ToastContainer({ toasts }: ToastProps) {
  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className={`toast ${toast.type}`} role="status" key={toast.id}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
