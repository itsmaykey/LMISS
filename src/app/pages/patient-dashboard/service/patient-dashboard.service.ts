import { Injectable,  } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PatientDashboardService {

  constructor(private http: HttpClient) { }

 getExistedPatientData(patientCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatient?patientCode=${patientCode}`);
  }
  postPatientProgressReport(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatasB/PostPatientProgressReport`, data);
  }

}
