import { Injectable } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PatientDashboardService {

  constructor(private http: HttpClient) { }

  getExistedPatientData(patientCode: string) {
      return this.http.get(`${environment.apiUrl}GetPatientData/GetExistedPatient?patientCode=${patientCode}`);
    }
}
