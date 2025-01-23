import { Injectable } from '@angular/core';
import { environment } from '../../Environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRegService {

  constructor(private http: HttpClient) { }


  getPositions() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefUserPositions`);
  }

  postRegistration(data: any) {
    return this.http.post(`${environment.apiUrl}Auth/PostUserRegistration`, data);
  }

}
