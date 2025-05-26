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
  service = inject(DashboardServiceService);

  isLoading = false;
  isModalVisible = false;
  scannedData: string = '';
  isCameraActive: boolean = false;
  hasSearched: boolean = false;
  patients: any[] = [];
  filteredSearchNames: any[] = [];
  searchText: string = '';
  @ViewChild(NgxScannerQrcodeComponent) scanner: NgxScannerQrcodeComponent | undefined;

  userInfo: any;


  constructor(private authService: AuthService, private router: Router) {

  }


  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.patientNames();
  }
  patientNames(): void {
    this.service.getPatients().subscribe((response: any) => {
      this.patients = response.map((owner: any) => ({ ...owner }));
      this.filteredSearchNames = [];
    });
  }
  
  FilteredSearchNames(): void {
    this.hasSearched = true; // <-- Mark that a search attempt has happened
  
    const search = this.searchText?.trim().toLowerCase();
  
    if (!search) {
      this.filteredSearchNames = [];
      return;
    }
  
    this.filteredSearchNames = this.patients.filter(patient =>
      Object.values(patient).some(value =>
        value?.toString().toLowerCase().includes(search)
      )
    );
  }
  
  


  goToAppDashboard() {
    this.router.navigate(['/application']);

  }
  goToApplicationDashboard(patientCode: string): void {
    if (!this.router) {
      console.error('Router is undefined!'); // Debugging check
      return;
    }
this.isLoading = true;
  setTimeout(() => {
    this.isLoading = false; // Hide loader after 3 seconds
  }, 3000);
    this.router.navigate(['/application', patientCode]);
  }

  goTopatientDashboard(patientCode: string): void {
    if (!this.router) {
      console.error('Router is undefined!'); // Debugging check
      return;
    }
this.isLoading = true;
  setTimeout(() => {
    this.isLoading = false; // Hide loader after 3 seconds
  }, 3000);
    this.router.navigate(['/patientDashboard', patientCode]);
  }
  ngOnDestroy(): void {
    if (this.scanner && this.isCameraActive) {
      this.scanner.stop();
    }
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
    const results = event as ScannerQRCodeResult[];
    if (results && results.length) {
      this.scannedData = results[0].value;
      this.searchText = this.scannedData.trimStart(); // Set the search text to the scanned data
      this.filteredSearchNames = this.patients.filter(patient =>
        Object.values(patient).some(value =>
          value != null && value.toString().toLowerCase().includes(this.scannedData.toLowerCase().trimStart())
        )

      );
      if(this.patients.length > 0){
      this.hideModal();
      }


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

