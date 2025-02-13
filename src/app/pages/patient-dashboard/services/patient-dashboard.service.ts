import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PatientDashboardService {

  constructor(private http: HttpClient) { }

  getCitymun() {
    return this.http.get(`${environment.apiUrl}GetAddressReference/GetCityMun`);
  }
  getBrgy() {
    return this.http.get(`${environment.apiUrl}GetAddressReference/GetBrgy`);
  }
  getprk() {
    return this.http.get(`${environment.apiUrl}GetAddressReference/GetPurok`);
  }

}
