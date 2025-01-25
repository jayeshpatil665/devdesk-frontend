import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatSidenavModule,RouterLink,RouterOutlet,MatIconModule,MatTooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  userLoggedIn : boolean = false;
  constructor(private router : Router){
   
  }

  ngOnInit(): void {

    this.userLoggedIn = (sessionStorage.getItem('userLoggedIn') === 'true'); 
    
      if(!this.userLoggedIn){
        this.router.navigate(['/login']);
      }
      else{
        this.router.navigate(['/home']);
      }

  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
