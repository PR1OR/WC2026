self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
      const anyVisible = ws.some(w => w.visibilityState === 'visible');
      if (anyVisible) return; // app is open — it handles its own notification
      return self.registration.showNotification(d.title || 'WC26 Sweepstake', {
        body: d.body || '',
        icon: '/color.png',
        badge: '/color.png',
        vibrate: [200, 100, 200],
        data: { url: self.location.origin }
      });
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
      for (const w of ws) {
        if (w.url.startsWith(self.location.origin) && 'focus' in w) return w.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
