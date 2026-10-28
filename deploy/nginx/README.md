# VISO — nginx on Hostinger VPS (Ubuntu)

Replace **`visogroup.com`** and paths if yours differ.

| Host | Config | Document root | Must NOT use |
|------|--------|---------------|--------------|
| **visogroup.com** | `viso-frontend.conf` | `/var/www/viso/frontend/dist` | admin dist, `return /admin` |
| **admin.visogroup.com** | `viso-admin.conf` | `/var/www/viso/admin/dist` | frontend dist only |

## Wrong site on visogroup.com?

If **visogroup.com** shows the **admin login/CMS** (or redirects to **/admin**), nginx is serving the **admin** app on the main domain.

**Check on the VPS:**

```bash
# Should print: viso-app" content="frontend"
curl -s https://visogroup.com/ | grep -o 'viso-app" content="[^"]*"'

# Should print: viso-app" content="admin"
curl -s https://admin.visogroup.com/ | grep -o 'viso-app" content="[^"]*"'
```

**Fix:**

```bash
sudo grep -r "root " /etc/nginx/sites-enabled/
```

For `server_name visogroup.com`, `root` must be **`/var/www/viso/frontend/dist`**.  
There must be **no** `return 301 /admin` on the main domain (that rule belongs only on **admin.visogroup.com**).

```bash
sudo cp /var/www/viso/deploy/nginx/viso-frontend.conf /etc/nginx/sites-available/viso-frontend.conf
sudo cp /var/www/viso/deploy/nginx/viso-admin.conf /etc/nginx/sites-available/viso-admin.conf
sudo ln -sf /etc/nginx/sites-available/viso-frontend.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/viso-admin.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Rebuild and deploy both apps:

```bash
cd /var/www/viso && npm run build && npm run build:admin
```

| Site | Build output |
|------|----------------|
| Public site | `frontend/dist` |
| Admin | `admin/dist` |

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
