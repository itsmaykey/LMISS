import { AuthService } from '../../Admin/Auth/AuthService';
import { Component , OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  constructor(private router: Router,private authService: AuthService) {}


logout(): void {
 // console.log('Logging out');
    this.authService.logout();
    this.router.navigate(['/login']);
}
isMenuOpen = false;

 userInfo:any;

 userRegHidden = true;


  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
  // console.log('User Info:', this.userInfo);

   // console.log(this.userInfo.position);
    if(this.userInfo.position === 'a001'){
      this.userRegHidden = false;
    }
  }
  toggleMenu(event: Event) {
    event.preventDefault();
    this.isMenuOpen = !this.isMenuOpen;
  }

  isActive(route: string, exactMatch: boolean = false): boolean {
    const currentUrl = this.router.url;

    if (exactMatch) {
      return currentUrl === route;
    } else {
      return currentUrl.startsWith(route);
    }
  }
}
