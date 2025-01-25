import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonResponse } from '../../Model/response/CommonResponse';
import { NewTask } from '../../Model/request/NewTask';
import { AuthenticateUserRequest } from '../../Model/request/AuthenticateUserRequest';
import { TaskList } from '../../Model/response/TaskList';
import { SpecificTaskDetailsRequest } from '../../Model/request/SpecificTaskDetailsRequest';
import { FilteredDataRequest } from '../../Model/request/FilteredDataRequest';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

constructor(private http : HttpClient) { }

headers = new HttpHeaders()
  .set('Content-Type','application/json')
  .set('Accept','application/json')
  .set('timeout','35000');

httpOptions = {
headers : this.headers,
};

addUpdateTask(payload : NewTask) : Observable<CommonResponse>{
  return this.http.post<CommonResponse>('addUpdateTask',payload,this.httpOptions);
}

getOverallTaskDetails(payload :AuthenticateUserRequest) : Observable<TaskList> {
  return this.http.post<TaskList>('getOverallTaskDetails',payload,this.httpOptions);
}

getSpecificTaskDetails(payload : SpecificTaskDetailsRequest) : Observable<TaskList> {

  return this.http.post<TaskList>('getSpecificTaskDetails',payload,this.httpOptions);
}

getFilteredTaskDetails(payload :FilteredDataRequest) : Observable<TaskList> {
  return this.http.post<TaskList>('getFilteredTaskDetails',payload,this.httpOptions);
}

}
