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
    const assessmentCode = params.get('assessmentCode');
    console.log('Assessment Code:', assessmentCode);
    console.log('Patient Code:', patientCode);
    if (patientCode && assessmentCode) {
      this.service.getExistedPatientData(patientCode, assessmentCode).subscribe({
        next: (response) => {
          if (response) {
               this.ExistedPatient = Array.isArray(response) ? response : [response];
               console.log(this.ExistedPatient);
                const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        this.ExistedPatient.forEach((item: any) => {
          const date = new Date(item.patientAssessmentDate);
          const monthName = monthNames[date.getMonth()];
          item.patientAssessmentDate = `${monthName} ${date
            .getDate()
            .toString()
            .padStart(2, '0')}, ${date.getFullYear()}`;
        });
            // console.log(this.ExistedPatient[0].pFirstName + ' ' + this.ExistedPatient[0].pMiddleName+' ' + this.ExistedPatient[0].pLastName);
            // console.log(this.ExistedPatient);
          } else {
           console.log("err")
          }
        },
        error: () => {
        },
      });
    } else {
      console.error('Missing patientCode or assessmentCode');
    }





  });
}
tryprint(): void{
  console.log(this.ExistedPatient[0].patientCode);
  // const docDefinition: TDocumentDefinitions = {
  const userData = this.ExistedPatient[0];
  console.log(userData);
  const docDefinition: TDocumentDefinitions = {
  pageSize: 'A7',
  pageOrientation: 'landscape',
  pageMargins: [20, 60, 20, 40],
  header: {
    text: 'LPRRC - LMISS',
    style: 'header',
    alignment: 'center',
    margin: [0, 10, 0, 20],
  },
  content: [
    {
      columns: [
        {
          qr: userData.patientCode,
          fit: 100,
          alignment: 'center',
        },
        // You can add more columns here if needed
      ],
      columnGap: 10,
    },
  ],
  footer: function () {
    return {
      columns: [
        {
          stack: [
            { text: `Nickname: ${userData.pNickName}`, style: 'footer' },
            { text: `Date of Admission: ${userData.patientAssessmentDate} `, style: 'footer' },
            { text: `Date of Discharged: ${userData.dateofDischarge}`, style: 'footer' },
          ],
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
      ],
    };
  },
  styles: {
    header: {
      fontSize: 18,
      bold: true,
    },
    info: {
      fontSize: 12,
      margin: [0, 5, 0, 0],
    },
    footer: {
      fontSize: 10,
    },
  },
};
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
