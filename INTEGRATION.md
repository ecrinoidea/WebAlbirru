# Integrasi TiDB Cloud + Cloudinary

Backend API sudah ditambahkan di `server/index.ts`.

1. Salin `.env.example` menjadi `.env` dan isi kredensial TiDB serta `CLOUDINARY_URL` **hanya di server**.
2. Pastikan `CA.pem` berada di root project (file tersebut sudah ada di repository).
3. Jalankan SQL pada database TiDB:

   ```bash
   mysql --host gateway01.ap-southeast-1.prod.aws.tidbcloud.com --port 4000 --user "$TIDB_USER" --password --ssl-ca CA.pem sys < server/schema.sql
   ```

4. Install dan jalankan API:

   ```bash
   npm install
   npm run dev:api
   ```

5. Frontend dapat memakai `src/lib/backend.ts`. Set `VITE_API_URL` bila API tidak berjalan di `http://localhost:8787`.

API yang tersedia:
- `GET /api/health` — cek koneksi TiDB dan Cloudinary.
- `GET/PUT /api/state` — penyimpanan state aplikasi di TiDB.
- `POST /api/cloudinary/signature` — signature upload foto berumur pendek; API secret tidak pernah dikirim ke browser.

Catatan keamanan: kredensial database dan Cloudinary yang sempat dibagikan di chat harus segera di-rotate/revoke. Jangan masukkan nilainya ke source code, `.env.example`, atau variable `VITE_*`.
