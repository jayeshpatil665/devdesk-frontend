import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticateUserRequest } from '../../Model/request/AuthenticateUserRequest';
import { Observable } from 'rxjs';
import { CommonResponse } from '../../Model/response/CommonResponse';
import { RegisterUserRequest } from '../../Model/request/RegisterUserRequest';
import { UsersNameDetail } from '../../Model/response/UsersNameDetail';
import { AuthenticateUserResponse } from '../../Model/response/AuthenticateUserResponse';
import { TaskPickedBy } from '../../Model/response/TaskPickedBy';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string = '';

  usersList : TaskPickedBy[]=[];


  constructor(private http: HttpClient) { 
    this.baseURL = sessionStorage.getItem('backendURL');
  }

  headers = new HttpHeaders()
                .set('Content-Type','application/json')
                .set('Accept','application/json')
                .set('timeout','35000');
  
  httpOptions = {
    headers : this.headers,
  };


  authenticateUser(authenticateUser : AuthenticateUserRequest): Observable<AuthenticateUserResponse>{
    return this.http.post<AuthenticateUserResponse>(`authenticate`,authenticateUser);
  }

  registerUser(payload : RegisterUserRequest) : Observable<CommonResponse>{
    return this.http.post<CommonResponse>('registerUser',payload,this.httpOptions);
  }

  getUserNameList(payload : AuthenticateUserRequest) : Observable<UsersNameDetail>{
    return this.http.post<UsersNameDetail>('getUserNameList',payload,this.httpOptions);
  }

  isAuthenticated() : boolean {
    if(sessionStorage.getItem('devTag') !== null){
      return true;
    }
    else{
      return false;
    }
  }

  
}
