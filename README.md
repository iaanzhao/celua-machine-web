# CelLua Machine web player

A browser version of the CelLua Machine v2.0.2 LÖVE game. The static page loads the original `.love` package through [love.js](https://github.com/2dengine/love.js).

## GitHub Pages

The Pages workflow publishes `dist/` from the `main` branch. GitHub Pages does not let this repository set custom HTTP response headers, so the page includes [coi-serviceworker](https://github.com/gzuidhof/coi-serviceworker), which provides cross-origin isolation through a service worker. The first visit may reload once while the service worker takes control.

## Source and licenses

The game source and assets are included in `dist/celua-machine-v2.0.2.love` and are licensed under GPL-3.0; see `dist/CELUA-GPL-3.0.txt`. The browser runtime and service worker notices are in `dist/LOVEJS-NOTICES.txt` and `dist/COI-SERVICEWORKER-MIT.txt`.

Upstream game: [KyYay/CelLua-Machine](https://github.com/KyYay/CelLua-Machine).
