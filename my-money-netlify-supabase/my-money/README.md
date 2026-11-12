# My Money

Aplikasi pencatatan keuangan pribadi berbahasa Indonesia. Frontend React + TypeScript + Vite; database Supabase PostgreSQL; deployment Netlify.

## Keamanan single-user tanpa akun

Aplikasi tidak memakai Supabase Auth. Karena frontend Netlify bersifat publik, tabel database TIDAK dibuka untuk `anon`. Semua operasi database melewati Supabase Edge Function `my-money-api`, yang memeriksa `APP_PASSWORD` di server dan memakai `SUPABASE_SERVICE_ROLE_KEY` hanya di sisi server. Jangan pernah menaruh service-role key di frontend.

## Setup Supabase

1. Buat project Supabase (region Singapore disarankan).
2. Jalankan `supabase/migrations/001_initial.sql` di SQL Editor.
3. Deploy Edge Function:
   `supabase functions deploy my-money-api`
4. Set secrets:
   `supabase secrets set APP_PASSWORD='GANTI_DENGAN_KODE_PANJANG_UNIK' SUPABASE_SERVICE_ROLE_KEY='SERVICE_ROLE_KEY_PROJECT'`
   `SUPABASE_URL` biasanya tersedia otomatis di Edge Functions. Jika belum, set juga dengan `supabase secrets set SUPABASE_URL='https://PROJECT.supabase.co'`.
5. Salin Project URL dan publishable/anon key untuk `.env` frontend.

## Local development

```bash
cp .env.example .env
# isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Netlify

- Push repository ke GitHub.
- Import repository di Netlify.
- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SUPABASE_FUNCTION_NAME` di Site configuration > Environment variables.
- Deploy. `netlify.toml` sudah menyertakan SPA fallback.

## Catatan fitur

Dashboard, pencatatan transaksi masuk/keluar, klasifikasi Primer/Sekunder, daftar kebutuhan kost, status pembelian, target tabungan (pembuatan), ringkasan laporan, dan ekspor CSV tersedia. Anggaran pada versi awal ini berupa ringkasan klasifikasi pengeluaran; plafon bulanan per kategori, edit transaksi, kontribusi tabungan, dan rentang tanggal lanjutan belum diimplementasikan.
