import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocialWorkerNotesService {

 constructor(private http: HttpClient) { }
 postPatientProgressReport(data: any) {
    return this.http.post(`${environment.apiUrl}PostPatientDatasB/PostPatientProgressReport`, data);
  }
}
