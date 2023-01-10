import { showNotification } from '@mantine/notifications';

export const storage_key = 'toronet-analytics';

export const session = localStorage.getItem(storage_key) ? JSON.parse(localStorage.getItem(storage_key)) : null;

export const showError = (error, message) => {
  return showNotification({
    color: 'red',
    radius: "md",
    title: 'An error occurred processing this request.',
    styles: (theme) => ({
      root: {
        padding: theme.spacing.lg,
      },
      title: {fontFamily: 'Poppins, sans-serif', color: theme.colors.red[9], fontWeight: 600, fontSize: theme.fontSizes.sm},
      description: {fontFamily: 'Poppins, sans-serif'},
    }),
    message: error ?? message,
  });
}