import * as Notifications from "expo-notifications";

export const scheduleHabitReminder = async (
  habitName: string,
  reminderId: string,
  time: string, // "HH:mm" format
) => {
  try {
    // parse time string
    const [hour, minute] = time.split(":").map(Number);

    // schedule daily repeating notification
    await Notifications.scheduleNotificationAsync({
      identifier: reminderId,
      content: {
        title: habitName,
        body: "Remember to complete habit",
        sound: "default",
        priority: "high",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hour,
        minute: minute,
      },
    });
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
  }
};

export const cancelReminder = async (reminderId: string) => {
  // get all scheduled notifications
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();

  // find and cancel reminders matching this id
  for (const notification of scheduled) {
    if (notification.identifier === reminderId) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }
};
