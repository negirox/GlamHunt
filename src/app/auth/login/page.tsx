'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRegistrations } from '@/app/admin/actions';
function generateRandomJWTLikeToken() {
  function base64url(str:string) {
    return Buffer.from(str)
      .toString('base64')
      .replace(/=/g, '')     // remove padding
      .replace(/\+/g, '-')   // replace '+' with '-'
      .replace(/\//g, '_');  // replace '/' with '_'
  }

  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payload = JSON.stringify({
    sub: Math.random().toString(36).substring(2),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  });
  const signature = [...Array(500)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join('');

  return `${base64url(header)}.${base64url(payload)}.${signature}`;
}
function generateTokenWithExpiry(payload:string, expiryInSeconds = 3600) {
  const expiresAt = Date.now() + expiryInSeconds * 1000;
  const tokenData = {
    payload,
    expiresAt
  };
  const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
  return token;
}

console.log(generateRandomJWTLikeToken());

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const registrations = await getRegistrations();
    const user = registrations.find(
      (model: any) => model.email === email
    );
    if (!user) {
      setError('Model does not exist');
      return;
    }
    if (user.password === password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('modelUser', JSON.stringify(user));
      localStorage.setItem('authToken', JSON.stringify(generateRandomJWTLikeToken() )); 
      sessionStorage.setItem('authToken', JSON.stringify(generateTokenWithExpiry(generateRandomJWTLikeToken()) )); 
      router.push('/profile');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-background rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Model Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
}
