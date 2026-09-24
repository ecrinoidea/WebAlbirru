const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8787').replace(/\/$/, '');

export async function getRemoteState<T>(): Promise<T | null> {
  const response = await fetch(`${API_URL}/api/state`);
  if (!response.ok) throw new Error('Tidak dapat terhubung ke TiDB.');
  return response.json() as Promise<T>;
}

export async function saveRemoteState(state: unknown): Promise<void> {
  const response = await fetch(`${API_URL}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!response.ok) throw new Error('Tidak dapat menyimpan data ke TiDB.');
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const signed = await fetch(`${API_URL}/api/cloudinary/signature`, { method: 'POST' });
  if (!signed.ok) throw new Error('Gagal menyiapkan upload Cloudinary.');
  const { timestamp, folder, signature, cloudName, apiKey } = await signed.json();
  const body = new FormData();
  body.append('file', file);
  body.append('timestamp', String(timestamp));
  body.append('folder', folder);
  body.append('signature', signature);
  body.append('api_key', apiKey);
  const uploaded = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body });
  if (!uploaded.ok) throw new Error('Upload foto ke Cloudinary gagal.');
  const result = await uploaded.json();
  return result.secure_url as string;
}
