import { Injectable } from '@angular/core';
import { environment } from '../../Environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {

  constructor(private http: HttpClient) { }


getPatients() {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetPatientData`);
  }

}
