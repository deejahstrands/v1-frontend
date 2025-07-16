import { toast as reactToastifyToast, ToastOptions } from 'react-toastify';

export const useToast = () => {
  const toast = {
    success: (message: string, options?: ToastOptions) => {
      reactToastifyToast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options,
      });
    },
    error: (message: string, options?: ToastOptions) => {
      reactToastifyToast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options,
      });
    },
    warning: (message: string, options?: ToastOptions) => {
      reactToastifyToast.warning(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options,
      });
    },
    info: (message: string, options?: ToastOptions) => {
      reactToastifyToast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        ...options,
      });
    },
  };

  return { toast };
}; 