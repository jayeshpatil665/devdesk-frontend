import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../services/AuthService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule,MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userName : string = '';
  constructor(private authService : AuthService,private router : Router){
    this.userName = sessionStorage.getItem('devName');

    if(this.userName===''){
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
