import notifier from 'node-notifier';

/** Fire a native desktop notification. Best-effort; never throws. */
export function notify(title: string, message: string): void {
  try {
    notifier.notify({
      title,
      message,
      sound: true,
      // macOS shows this in the notification subtitle / app name slot.
      appID: 'Helm',
    });
  } catch {
    // Notifications are a nice-to-have; ignore failures silently.
  }
}
