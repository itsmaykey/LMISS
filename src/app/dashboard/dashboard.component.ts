import { Component, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { NgxScannerQrcodeComponent, ScannerQRCodeResult } from 'ngx-scanner-qrcode';
import { AuthService } from '../Admin/Auth/AuthService';
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

  @ViewChild(NgxScannerQrcodeComponent) scanner: NgxScannerQrcodeComponent | undefined;

  userInfo: any;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
   // console.log('Dashboard initialized');
    this.userInfo = this.authService.getUserInfo();
    //console.log('User Info:', this.userInfo);
  }
  goToAppDashboard() {
    this.router.navigate(['/applicationDashboard']); 
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

