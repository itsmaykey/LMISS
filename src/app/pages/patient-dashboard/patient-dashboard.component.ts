import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PatientDashboardService } from './service/patient-dashboard.service';
// Update the import path below if the actual path is different
import { AuthService } from '../../Admin/Auth/AuthService';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { SocialWorkerNotesService } from './ScriptForms/SocialWorkerNotes/social-worker-notes.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
pdfMake.vfs = pdfFonts.vfs;

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent  implements OnInit {
  modalInstance: Modal | null = null;

  ExistedPatientCode = '';
  ExistedPatient: any = [];
  AssessmentCode = '';
  userInfo: any; // <-- Declare userInfo property
  SocialWorkerNotesForm!: FormGroup; 
  isSubmitting = false;
  fb: FormBuilder;
  modalElementRef: any;
  constructor(private router: Router,http: HttpClient,
     private route: ActivatedRoute,
     private service: PatientDashboardService,
     private authService: AuthService, // <-- Inject AuthService
     fb: FormBuilder,
     private SocialWorkerNotesService: SocialWorkerNotesService,
  ) {
    this.fb = fb;
  }
  

  showModal(): void {
    const modalElement = document.getElementById('backDropModal');
    if (!modalElement) {
      console.error('Modal element not found in DOM');
      return;
    }

    this.modalInstance = new Modal(modalElement);
    this.modalInstance.show();
  }

  hideModal(): void {
    this.modalInstance?.hide();
  }
  ngOnInit(): void {
    this.getExisted();
     this.userInfo = this.authService.getUserInfo();
    console.log('Staff ID No:', this.userInfo.id);

   
    const assessmentCode = this.route.snapshot.paramMap.get('assessmentCode');
    const patientCode = this.route.snapshot.paramMap.get('patientCode') || '';
    this.ExistedPatientCode = patientCode;
    
    this.SocialWorkerNotesForm = this.fb.group({
      recNo: 0,
      patientCode: patientCode,
      interventionCode: assessmentCode,
      staffIdNo: this.userInfo.id,
      patientActivies: ['', Validators.required],
      patientIntervention: ['', Validators.required],
      interventionDate: ['', Validators.required]
    });
  }

getExisted(): void {
  this.route.paramMap.subscribe((params) => {
    const patientCode = params.get('patientCode');
    const assessmentCode = params.get('assessmentCode');
    console.log('Assessment Code:', assessmentCode);
    console.log('Patient Code:', patientCode);
    if (patientCode) {
      this.service.getExistedPatientData(patientCode).subscribe({
        next: (response) => {
          this.ExistedPatient = response;
          if (this.ExistedPatient.length > 0) {
            console.log(this.ExistedPatient);
          } else {
           console.log("err")
          }
        },
        error: () => {

        },
      });
    }
  });
}
tryprint(): void{
  console.log(this.ExistedPatient[0].patientCode);
  const docDefinition: TDocumentDefinitions = {
    content: [
      // { text: 'Luntiang Paraiso Regional Rehabilitation Center',
      //    style: 'header',
      //    alignment: 'center',
      //    fontSize: 14,
      //     bold: true,
      //     margin: [0, 20, 0, 8]
      //  },

      {
        table: {
          body: [
            [

              {
                 qr: '\n \n'+ this.ExistedPatient[0].patientCode,
                 // ← this can be any text or URL
                 fit: 80, // optional: size of the QR
               //LEFT TOP  RIGHT BOTTOM
                 margin: [15, 10, 0, 10],
                 border: [true, true, false, true], // remove borders
              },
              {
                text: 'Luntiang Paraiso Regional Rehabilitation Center \n \n'
                + this.ExistedPatient[0].pLastName + ', ' +this.ExistedPatient[0].pFirstName + ' ' + this.ExistedPatient[0].pMiddleName + '\n \n'
                + 'INPATIENT',
                 //LEFT TOP BOTTOM RIGHT
                margin: [0, 10, 0, 10],
                border: [false, true, true, true], // remove borders
              },



            ]
          ],

        },
        margin: [10, 10, 10, 10], // Optional: add margin to the table
        alignment: 'center',
       // Optional: remove borders around the table
      },
      ],
      }


  pdfMake.createPdf(docDefinition).open();

}


SocialWorkerNotesFormSubmit(): void {
  if (this.SocialWorkerNotesForm.invalid) {
    this.SocialWorkerNotesForm.markAllAsTouched(); 
    return;
  }

  this.isSubmitting = true;

  const formData = this.SocialWorkerNotesForm.value;
  console.log(formData);

  this.SocialWorkerNotesService.postPatientProgressReport( formData ).subscribe({
    
    next: (response) => {
      console.log('Form saved successfully:', response);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Patient progress report submitted successfully!',
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      this.hideModal();
      this.SocialWorkerNotesForm.reset();
      this.isSubmitting = false;
    },
    error: (error) => {
      console.error('Error saving form:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to submit patient progress report. Please try again.',
        showConfirmButton: true,
        allowOutsideClick: true,
        allowEscapeKey: true
      });

      this.isSubmitting = false;
    }
  });
}

}
  


