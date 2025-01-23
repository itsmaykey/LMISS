import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../Environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

   private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // PostLogin(username: string, password: string): Observable<any> {
  //   const loginData = { username, password };
  //   return this.http.post<any>(this.apiUrl, loginData)

  // }


  PostLogin(username: string, password: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}Auth/Login?username=${username}&password=${password}`);
  }


  // login(username: string, password: string): Observable<any> {
  //   const loginData = { username, password };
  //   return this.http.post<any>(this.apiUrl, loginData);
  // }
}
