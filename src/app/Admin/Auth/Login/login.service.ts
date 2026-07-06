import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://172.16.0.20/LMISSWebApi/api/Auth/PostLogin';

  constructor(private http: HttpClient) { }

  PostLogin(username: string, password: string): Observable<HttpResponse<any>> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   // console.log('Request Body:', body); // Log the request body
    return this.http.post<any>(this.apiUrl, body, { headers, observe: 'response' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error);
    if (error.error.errors) {
      console.error('Validation errors:', error.error.errors);
      for (const [key, value] of Object.entries(error.error.errors)) {
        console.error(`${key}: ${value}`);
      }
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

}
