# VISO — nginx on Hostinger VPS (Ubuntu)

Replace **`visogroup.com`** and paths if yours differ.

| Site | Config file | Document root | API |
|------|-------------|---------------|-----|
| Public site | `viso-frontend.conf` | `/var/www/viso/frontend/dist` | `/api/` → Node `:8787` |
| Admin | `viso-admin.conf` | `/var/www/viso/admin/dist` | `/api/` → Node `:8787` |
| Backend | (no separate vhost) | — | PM2: `cd backend && npm run pm2:backend` |

## 1. Build on the server

```bash
cd /var/www/viso
git pull
npm install
npm run build
npm run build:admin
```

Set **`frontend/.env`** and **`admin/.env`** before build (`VITE_*`). Set **`backend/.env`** for secrets.

## 2. Install configs

```bash
sudo cp deploy/nginx/viso-upstream.conf /etc/nginx/conf.d/viso-upstream.conf
sudo cp deploy/nginx/viso-frontend.conf /etc/nginx/sites-available/viso-frontend.conf
sudo cp deploy/nginx/viso-admin.conf /etc/nginx/sites-available/viso-admin.conf

sudo ln -sf /etc/nginx/sites-available/viso-frontend.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/viso-admin.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

sudo nginx -t && sudo systemctl reload nginx
```

## 3. DNS (Hostinger)

| Type | Name | Value |
|------|------|--------|
| A | `@` | VPS IP |
| A | `www` | VPS IP |
| A | `admin` | VPS IP |

## 4. HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d visogroup.com -d www.visogroup.com -d admin.visogroup.com
```

## 5. Backend (PM2)

```bash
cd /var/www/viso/backend
npm run pm2:backend
pm2 save
pm2 startup
```

Test API:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8787/api/chat
```

## Optional: API on main domain only

If you prefer admin to call the main site for API, set in **`admin/.env`** before build:

```env
VITE_API_URL=https://visogroup.com
```

Then you can remove the `/api/` block from `viso-admin.conf` (admin static only).
