// **FILE FORMATTED WITH @ext:esbenp.prettier-vscode**

// Concat app name and version for easier and more dynamic cache naming
const APP_PREFIX = "Budget_Tracker_";
const APP_VERSION = "V01";
const CACHE_NAME = APP_PREFIX + APP_VERSION;

const FILES_TO_CACHE = [
  // HTML FILES
  '/',
  './index.html',

  // JSON FILES
  './manifest.json',

  // CSS FILES
  './css/styles',

  // JS FILES
  './js/index.js',
  './js/idb.js'
]

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  );
});

// delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (e) {
  console.log("fetch request : " + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log("Responding with cache : " + e.request.url)
        return request;
      } else {
        console.log("File is not cached, fetching : " + e.request.url)
        return fetch(e.request);
      }
      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})