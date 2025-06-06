import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRegService {

  constructor(private http: HttpClient) { }

  getUserList() {
    return this.http.get(`${environment.apiUrl}Auth/GetUsersData`);
  }
  getPositions() {
    return this.http.get(`${environment.apiUrl}GetPatientAdmissionReference/GetrefUserPositions`);
  }

  postRegistration(data: any) {
    return this.http.post(`${environment.apiUrl}Auth/PostUserRegistration`, data);
  }

}
