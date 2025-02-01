import { Component, Inject, OnInit ,signal} from '@angular/core';

import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';

import {FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import {MatIconModule} from '@angular/material/icon';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/AuthService/auth.service';
import { AuthenticateUserRequest } from '../Model/request/AuthenticateUserRequest';
import { AuthenticateUserResponse } from '../Model/response/AuthenticateUserResponse';
import { UsersNameDetail } from '../Model/response/UsersNameDetail';
import { MatSnackBar } from '@angular/material/snack-bar';

import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule,MatSelectModule,
    FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,
    MatButtonModule,MatIconModule,MatToolbarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  
  currentYear: number = new Date().getFullYear();

  protected readonly value = signal('');

  protected onInput(event: Event) {
    this.value.set((event.target as HTMLInputElement).value);
  }
  
  constructor(@Inject(DOCUMENT)private document : Document,private router : Router,private authService : AuthService,private _snackBar: MatSnackBar){

  }

  ngOnInit(): void {

  }


  getUserNameList(payload: AuthenticateUserRequest) {

    this.authService.getUserNameList(payload).subscribe(
      (resp:UsersNameDetail)=>{
        //console.log('userNameList respponse : ',resp);
        this.authService.usersList = resp.usersList;
        sessionStorage.setItem('usersList',JSON.stringify(resp.usersList));
        this.router.navigate(['']);
      },
      (error)=>{
        console.log('Error occured while retriving username list : ',JSON.stringify(error));
      },
      ()=>{
        console.log('Get users list request complete');
      }
    );
  }


  loginUser(paramUserName : string,paramDevType:string){
    if(paramUserName !== null && paramDevType!==null && paramUserName!=='' && paramDevType!=='' && paramUserName.length===7 && Number(paramUserName)>0){
      //console.log(`empId : ${paramUserName} , devType : ${paramDevType}`);
      this.createBackendURL(Number(paramUserName),paramDevType);
    }
    else{
      this.openSnackBar('Invalid credentials !','X');
    }
    
  }

  currentURL : string='';
  short : string='';
  createBackendURL(empId:number,devTag:string){
    this.currentURL = this.document.location.href;
    //console.log(this.document.location.href);
    
    let split = this.currentURL.split('/');
   // console.log('Split is : ',split);

    this.short = split[0] + '//' + split[2] + '/' + 'devdesk';
    //this.short = 'localhost:8084' + '/' + 'devdesk';

   //console.log('short url is : ',this.short);
    sessionStorage.setItem('backendURL',this.short);

    this.authenticateUser(empId,devTag);
  }

  authenticateUser(empId:number,devTag:string){
    let request = new AuthenticateUserRequest();
    request.empId = empId;
    request.devTag = devTag;

    this.authService.authenticateUser(request).subscribe(
      (resp:AuthenticateUserResponse)=>{
        //console.log('Response recieved ',resp);
        
        if(resp.status === "SUCCESS"){
          sessionStorage.setItem('userLoggedIn','true');

          sessionStorage.setItem('devTag',resp.devTag);
          sessionStorage.setItem('empId',''+resp.empId);
          sessionStorage.setItem('devName',resp.devName);
  
          this.getUserNameList(request);
        }
        else{
          this.openSnackBar('Unable to login, Invalid credentials !','X');
        }

      },
      (error)=>{
        console.log('Error occured while authenticting user ',error);
        this.openSnackBar('Unable to login !','X');
      },
      ()=>{
        console.log('Auth user request completed !');
      }
    );
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message,action,{
      horizontalPosition : 'end',
      verticalPosition : 'bottom',
      duration : 3*1000,
    });
  }

}
