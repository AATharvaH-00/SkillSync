import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);   // { message, type }
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, type });
    // Trigger the enter animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setToast(null), 400);
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          id="skillsync-toast"
          className={`toast toast-${toast.type}${visible ? ' toast-show' : ''}`}
        >
          <span className="toast-icon">
            {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
