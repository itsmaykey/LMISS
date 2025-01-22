import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';  // Import the component

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  isModalVisible = false;
  output: string = '';
  isCameraActive: boolean = false;

  @ViewChild(NgxScannerQrcodeComponent) scanner: NgxScannerQrcodeComponent | undefined;

  constructor(private cdRef: ChangeDetectorRef) {}

  hideModal(): void {
    this.isModalVisible = false;
    if (this.scanner && this.isCameraActive) {
      this.scanner.stop();  // Stop the camera when the modal is closed
      this.isCameraActive = false;
    }
  }

  onError(error: any): void {
    console.error("Error scanning QR code: ", error);
  }

  onData(event: any): void {
    if (typeof event === 'string') {
      this.output = event;
      alert('Scanned QR Code: ' + this.output); // Alert the scanned QR code
    }
  }

  toggleCamera(): void {
    this.isModalVisible = true;
    if (this.scanner) {
      if (this.isCameraActive) {
        this.scanner.stop();  
      } else {
        this.scanner.start(); 
      }
      this.isCameraActive = !this.isCameraActive;
    }
  
    // Delay to allow Angular to finish change detection
    setTimeout(() => {
      this.cdRef.detectChanges();
    });
  }
}  
