import React, { createContext, useContext, useState, useCallback } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    
    // Automatically remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast Portal/Container */}
      <div className="fixed right-4 top-4 z-50 flex flex-col gap-2 max-w-sm w-full sm:w-96">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-xl shadow-lg border transform transition-all duration-300 translate-y-0 ease-out glass-effect ${
              toast.type === 'success'
                ? 'bg-emerald-50/90 text-emerald-900 border-emerald-100'
                : toast.type === 'error'
                ? 'bg-rose-50/90 text-rose-900 border-rose-100'
                : 'bg-blue-50/90 text-blue-900 border-blue-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <IoCheckmarkCircle className="text-emerald-500 h-6 w-6 shrink-0" />}
              {toast.type === 'error' && <IoCloseCircle className="text-rose-500 h-6 w-6 shrink-0" />}
              {toast.type === 'info' && <IoInformationCircle className="text-blue-500 h-6 w-6 shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100/50"
            >
              <IoClose className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
