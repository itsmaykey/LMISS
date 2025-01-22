import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']  
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  isActive(route: string, exactMatch: boolean = false): boolean {
    const currentUrl = this.router.url;
    
    if (exactMatch) {
      return currentUrl === route;  
    } else {
      return currentUrl.startsWith(route);  
    }
  }
}
