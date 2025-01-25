import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../services/AuthService/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule,MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  userName : string = '';
  constructor(private authService : AuthService){
    this.userName = authService.devName;
  }
}
