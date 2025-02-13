import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private tokenExpirationKey = 'tokenExpiration';

  constructor() { }

  setToken(token: string, expiresIn: number): void {
    const expirationDate = new Date().getTime() + expiresIn * 3600; // expiresIn is in seconds
    //console.log('Expiration Date:', expirationDate);
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tokenExpirationKey, expirationDate.toString());
  }

  getToken(): string | null {
    const expirationDate = localStorage.getItem(this.tokenExpirationKey);
    if (expirationDate && new Date().getTime() > +expirationDate) {
      this.clearToken();
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
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
  }
}
