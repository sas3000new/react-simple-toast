
import React, { useState, useEffect, createContext, useContext } from 'react';

// Toast Context
const ToastContext = createContext(null);

// Toast Provider Component
export const ToastProvider = ({ children, position = 'bottom-right', duration = 3000 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} position={position} />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast, position }) => {
  const positionStyles = {
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
  };

  const typeStyles = {
    success: { backgroundColor: '#10b981' },
    error: { backgroundColor: '#ef4444' },
    info: { backgroundColor: '#3b82f6' },
    warning: { backgroundColor: '#f59e0b' },
  };

  return (
    <div style={{
      position: 'fixed',
      zIndex: 9999,
      ...positionStyles[position]
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          style={{
            padding: '12px 24px',
            margin: '8px 0',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease-out',
            ...typeStyles[toast.type]
          }}
        >
          {toast.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Direct toast function (no provider needed - simpler API)
let globalAddToast = null;

export const setToastHandler = (handler) => {
  globalAddToast = handler;
};

const toast = (message, type = 'info') => {
  if (globalAddToast) {
    globalAddToast(message, type);
  } else {
    console.warn('Toast not initialized. Wrap your app with ToastProvider or call initializeToast()');
  }
};

toast.success = (message) => toast(message, 'success');
toast.error = (message) => toast(message, 'error');
toast.info = (message) => toast(message, 'info');
toast.warning = (message) => toast(message, 'warning');

export default toast;