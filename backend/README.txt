1) В Render создай New -> Web Service
2) Репозиторий: тот же GitHub
3) Root Directory: backend
4) Environment: Node
5) Build Command: npm install
6) Start Command: npm start
7) Добавь Environment Variables:
   DATABASE_URL=вставь Internal Database URL
   ADMIN_PIN=2012
   CORS_ORIGIN=адрес сайта на Vercel, например https://kuba-premium.vercel.app
8) После деплоя скопируй адрес сервиса вида https://имя.onrender.com
9) Открой config.js в корне сайта и вставь этот адрес в window.KUBA_API_BASE
10) Закоммить и задеплой сайт заново на Vercel
