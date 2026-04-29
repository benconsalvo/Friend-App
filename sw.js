// This is the power source (it lets the app run even when it's not "plugged into" the internet).

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});