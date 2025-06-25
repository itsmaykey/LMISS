import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PatientDashboardService } from '../../service/patient-dashboard.service';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class SocialWorkerNotesService {

   constructor(
     private fb: FormBuilder,
     private patientDashboardService: PatientDashboardService
   ) {}
 
    
}
