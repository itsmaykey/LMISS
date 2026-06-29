import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private tokenExpirationKey = 'tokenExpiration';
 private encryptionKey = 'your-secret-key'; // Optional, if you want to encrypt the token
  constructor() { }

  setToken(token: string, expiresIn: number): void {
   const expirationDate = new Date().getTime() + expiresIn * 3600;

  // Encrypt the token before storing
  const encryptedToken = CryptoJS.AES.encrypt(token, this.encryptionKey).toString();

  localStorage.setItem(this.tokenKey, encryptedToken);
  localStorage.setItem(this.tokenExpirationKey, expirationDate.toString());
  }
getToken(): string | null {
  const expirationDate = localStorage.getItem(this.tokenExpirationKey);
  if (expirationDate && new Date().getTime() > +expirationDate) {
    this.clearToken();
    return null;
  }

  const encryptedToken = localStorage.getItem(this.tokenKey);
  if (!encryptedToken) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.encryptionKey);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedToken || null;
  } catch (e) {
    console.error('Failed to decrypt token', e);
    return null;
  }
}
  // getToken(): string | null {
  //   const expirationDate = localStorage.getItem(this.tokenExpirationKey);
  //   if (expirationDate && new Date().getTime() > +expirationDate) {
  //     this.clearToken();
  //     return null;
  //   }
  //   return localStorage.getItem(this.tokenKey);
  // }

  clearToken(): void {
    localStorage.removeItem(this.encryptionKey);
    localStorage.removeItem(this.tokenExpirationKey);
    localStorage.removeItem('userInfo');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  setUserInfo(userInfo: any): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  getUserInfo(): any {
    return JSON.parse(localStorage.getItem('userInfo') || '{}');
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
    localStorage.removeItem('userInfo');
  }
}
