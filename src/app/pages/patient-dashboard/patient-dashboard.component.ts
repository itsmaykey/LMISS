import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PatientDashboardService } from './service/patient-dashboard.service';

pdfMake.vfs = pdfFonts.vfs;

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent  {


  ExistedPatient: any = [];


  constructor(private router: Router,
     private route: ActivatedRoute,
     private service: PatientDashboardService
  ) {}


  ngOnInit(): void {
    this.getExisted();
  }

getExisted(): void {
  this.route.paramMap.subscribe((params) => {
    const patientCode = params.get('patientCode');
    if (patientCode) {
      this.service.getExistedPatientData(patientCode).subscribe({
        next: (response) => {
          this.ExistedPatient = response;
          if (this.ExistedPatient.length > 0) {
            console.log(this.ExistedPatient[0].pFirstName + ' ' + this.ExistedPatient[0].pMiddleName+' ' + this.ExistedPatient[0].pLastName);
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

  navigateToDashboard(): void {
    this.router.navigate(['/applicationDashboard']);

  }
}
//  { text: 'Scan the QR below:', margin: [0, 10, 0, 10] },
// {
//   qr:  this.ExistedPatient[0].patientCode,
//   alignment: 'center',
//    // ← this can be any text or URL
//   fit: 100 // optional: size of the QR
// },
// {
//   text: this.ExistedPatient[0].pLastName + ', ' +this.ExistedPatient[0].pFirstName + ' ' + this.ExistedPatient[0].pMiddleName,
//   alignment: 'center',
// }
// ],
// styles: {
// header: {
//   fontSize: 18,
//   bold: true,
//   margin: [0, 0, 0, 10]
// }
// }
// };
