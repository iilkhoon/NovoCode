# NovoCode — serverə qurmaq

Bu təlimat bir serverdə (məs. 96 GB RAM-lı Windows server) NovoCode-u işə salmaq üçündür.
Yayımlanan saytlar da eyni serverdə, `ad.novocode.app` ünvanlarında açılır.

## 1. Nə lazımdır

| Nə | Niyə |
| --- | --- |
| Node.js 20+ | Tətbiqin özü |
| Domen (məs. `novocode.app`) | Əsas sayt və `*.novocode.app` yayımları |
| Caddy (və ya Cloudflare Tunnel) | HTTPS sertifikatları, domeni serverə yönləndirmək |
| NVIDIA API açarı | AI (build.nvidia.com, pulsuz) |
| İstəyə bağlı: Pexels açarı, Supabase layihəsi | Real şəkillər; hesablar və bulud sinxronizasiyası |

Windows-da ən rahat yol **WSL2 (Ubuntu)** içində işlətməkdir; aşağıdakı əmrlər Ubuntu üçündür.

## 2. Kodu qurmaq

```bash
git clone -b claude/dreamy-noether-wqdv0u https://github.com/iilkhoon/NovoCode.git
cd NovoCode
npm ci
cp .env.example .env.local   # sonra faylı doldurun (aşağıya baxın)
npm run build
```

`.env.local` üçün minimum:

```
NVIDIA_API_KEY=nvapi-...
NOVO_ADMIN_PASSWORD=uzun-və-gizli-bir-şifrə
NOVO_ROOT_DOMAIN=novocode.app
NEXT_PUBLIC_SITE_URL=https://novocode.app
NOVO_DATA_DIR=/var/lib/novocode        # yayımlar, AI ayarları, xərc logu burada saxlanılır
```

İstəyə bağlı: `PEXELS_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
(Supabase-də `supabase/schema.sql` faylını SQL Editor-da işə salın, Auth → Providers-də Google və GitHub-ı açın).

## 3. Daimi işləmə (PM2)

```bash
sudo npm i -g pm2
pm2 start "npm run start" --name novocode
pm2 save && pm2 startup
```

## 4. Domen və HTTPS (Caddy)

DNS-də iki qeyd: `novocode.app` → server IP, `*.novocode.app` → server IP.
Wildcard sertifikat üçün Caddy-nin DNS plaqini lazımdır (məs. Cloudflare DNS):

```
novocode.app, *.novocode.app {
  tls {
    dns cloudflare {env.CF_API_TOKEN}
  }
  reverse_proxy 127.0.0.1:3000
}
```

Alternativ: **Cloudflare Tunnel** — sabit IP və port açmaq lazım deyil; `novocode.app` və `*.novocode.app` hostlarını `http://localhost:3000`-a yönləndirin.

## 5. Yoxlama

1. `https://novocode.app` açılır, sağ yuxarıda dil seçici işləyir.
2. `https://novocode.app/admin` — `NOVO_ADMIN_PASSWORD` ilə daxil olun, NVIDIA “Aktiv” görünür.
3. Studio-da sayt qurun → **Yayımla** → `https://ad-xxxx.novocode.app` açılır.

## 6. Ehtiyat nüsxə

`NOVO_DATA_DIR` qovluğunu gündəlik kopyalayın (yayımlanmış saytlar, şifrəli AI açarları, xərc logu).
`NOVO_ADMIN_PASSWORD` dəyişsə, admin paneldə əlavə edilmiş provayder açarlarını yenidən daxil etmək lazımdır.

## Qeydlər

- Canlı önizləmə istifadəçinin brauzerində (WebContainers) işləyir — serverə yük salmır. Kommersiya istifadəsi üçün StackBlitz lisenziyası lazımdır.
- Vercel kimi “serverless” hostinqdə yayımlar diskdə qalmır; orada yayım üçün obyekt anbarı (R2/S3) lazımdır.
