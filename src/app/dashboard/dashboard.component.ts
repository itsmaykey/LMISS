import { Component, inject, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { AuthService } from '../Admin/Auth/AuthService';
import { DashboardServiceService } from './dashboard-service/dashboard-service.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isModalVisible = false;
  scannedData: string = '';
  isCameraActive: boolean = false;
  service = inject(DashboardServiceService);

  patients: any[] = [];
  filteredSearchNames: any[] = [];
  searchText: string = '';
  @ViewChild(NgxScannerQrcodeComponent) scanner: NgxScannerQrcodeComponent | undefined;

  userInfo: any;
  router: any;
  constructor(private authService: AuthService,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
   // console.log('Dashboard initialized');
    this.userInfo = this.authService.getUserInfo();
    //console.log('User Info:', this.userInfo);
    this.patientNames();
  }
  goToAppDashboard() {
    this.router.navigate(['/applicationDashboard']); 
  }
  ngOnDestroy(): void {
    if (this.scanner && this.isCameraActive) {
      this.scanner.stop();
    }
    
  }
  patientNames(): void {
    this.service.getPatients().subscribe((response: any) => {
      this.patients = response.map((owner: any) => ({ ...owner }));
      this.filteredSearchNames = []; // Start with an empty table
    });
  }

  FilteredSearchNames(): void {
    if (!this.searchText || this.searchText.trim() === '') {
      this.filteredSearchNames = []; // Show nothing when search is empty
      return;
    }

    const search = this.searchText.toLowerCase().trim();

    this.filteredSearchNames = this.patients.filter(patient =>
      Object.values(patient).some(value =>
        value != null && value.toString().toLowerCase().includes(search)
      )
    );
  }
  public handle(action: NgxScannerQrcodeComponent, fn: string): void {
    const validMethods = ['start', 'stop'];

    if (!validMethods.includes(fn)) {
      console.error(`Invalid method: ${fn}`);
      return;
    }

    if (fn === 'start') {
      this.isModalVisible = true;
      action.start((devices: MediaDeviceInfo[]) => {
        const backCamera = devices.find((device) =>
          /back|rear|environment/gi.test(device.label)
        );
        action.playDevice(backCamera ? backCamera.deviceId : devices[0]?.deviceId);
      }).subscribe(
        (result) => console.log('Start success', result),
        (error) => this.onError(error)
      );
    } else if (fn === 'stop') {
      action.stop().subscribe(
        (result) => {
          console.log('Stop success', result);
          this.isModalVisible = false;
        },
        (error) => this.onError(error)
      );
    }
  }



  public onEvent(event: any): void {
    const results = event as ScannerQRCodeResult[]; // Cast to ScannerQRCodeResult[]
    if (results && results.length) {
      this.scannedData = results[0].value; // Update scanned data
      console.log('Scanned QR Code:', this.scannedData);
    }
  }


  onError(error: Error): void {
    console.error('QR Scan Error:', error);
    this.scannedData = 'An error occurred while scanning. Please try again.';
  }

  hideModal(): void {
    this.isModalVisible = false;
    if (this.scanner) {
      this.scanner.stop().subscribe(
        () => {
          console.log('Camera stopped successfully');
          this.isCameraActive = false;
          this.scannedData ='';
        },
        (error) => console.error('Error stopping camera:', error)
      );
    }
  }
  
}

