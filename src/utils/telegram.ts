import { WebApp } from '@twa-dev/sdk';

export const initTelegramWebApp = () => {
  try {
    if (window.Telegram?.WebApp) {
      // Ensure the Web App is properly initialized
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.enableClosingConfirmation();

      // Set up MainButton if needed
      if (window.Telegram.WebApp.MainButton) {
        window.Telegram.WebApp.MainButton.setParams({
          text: 'START MINING',
          color: '#2ecc71',
          textColor: '#ffffff',
          is_visible: true
        });
      }

      // Handle viewport changes
      window.Telegram.WebApp.onEvent('viewportChanged', () => {
        // Adjust UI based on viewport changes
      });

      return true;
    }
  } catch (error) {
    console.error('Failed to initialize Telegram Web App:', error);
  }
  return false;
};

export const getTelegramUser = () => {
  try {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      return window.Telegram.WebApp.initDataUnsafe.user;
    }
  } catch (error) {
    console.error('Failed to get Telegram user:', error);
  }
  return null;
};

export const sendDataToBot = (data: any) => {
  try {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(data));
      return true;
    }
  } catch (error) {
    console.error('Failed to send data to bot:', error);
  }
  return false;
};

export const closeTelegramWebApp = () => {
  try {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  } catch (error) {
    console.error('Failed to close Telegram Web App:', error);
  }
};