import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientDashboardService } from './services/patient-dashboard.service';
@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrl: './patient-dashboard.component.css'
})
export class PatientDashboardComponent  {

  constructor(private router: Router) {}




  navigateToDashboard(): void {
    this.router.navigate(['/applicationDashboard']);

  }
}
