import { Injectable,  } from '@angular/core';
import { environment } from '../../../Environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PatientDashboardService {

  constructor(private http: HttpClient) { }

 getExistedPatientData(patientCode: string, assessmentCode: string) {
    return this.http.get(`${environment.apiUrl}GetPatientDatasA/GetExistedPatient?patientCode=${patientCode}&assessmentCode=${assessmentCode}`);
  }
      // getExistedPatientData(patientCode: string): Observable<any[]> {
      //   return this.http.get<any[]>(`${this.apiUrl}/patients/${patientCode}`);
      // }

}
