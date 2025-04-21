// public/service-worker.js
self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/path/to/icon.png',
    });
  });
  
  self.addEventListener('message', event => {
    if (event.data.type === 'setAlarm') {
      const { taskDateTime, taskText } = event.data;
      const delay = new Date(taskDateTime) - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          self.registration.showNotification(`Reminder: ${taskText}`, {
            body: 'Time to complete your task!',
          });
        }, delay);
      }
    }
  });