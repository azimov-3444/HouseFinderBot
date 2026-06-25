import { useEffect } from 'react';

const BotpressWebchat = () => {
  useEffect(() => {
    const injectUrl = import.meta.env.VITE_BOTPRESS_INJECT_URL;
    const configUrl = import.meta.env.VITE_BOTPRESS_CONFIG_URL;

    if (!injectUrl || !configUrl) {
      console.info('Botpress webchat is not configured. Set VITE_BOTPRESS_INJECT_URL and VITE_BOTPRESS_CONFIG_URL.');
      return;
    }

    const existingInject = document.querySelector(`script[src="${injectUrl}"]`);
    const existingConfig = document.querySelector(`script[src="${configUrl}"]`);

    const loadConfig = () => {
      if (existingConfig) return;
      const configScript = document.createElement('script');
      configScript.src = configUrl;
      configScript.defer = true;
      document.head.appendChild(configScript);
    };

    if (existingInject) {
      loadConfig();
      return;
    }

    const injectScript = document.createElement('script');
    injectScript.src = injectUrl;
    injectScript.async = true;
    injectScript.onload = loadConfig;
    document.head.appendChild(injectScript);

    return () => {
      injectScript.onload = null;
    };
  }, []);

  return null;
};

export default BotpressWebchat;
