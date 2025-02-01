import { Component, inject, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';

import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormControl, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { MatExpansionModule } from '@angular/material/expansion';
import {MatChipsModule} from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { TasksService } from '../services/TasksService/tasks.service';
import { AuthService } from '../services/AuthService/auth.service';
import { Task } from '../Model/response/Task';
import { TaskList } from '../Model/response/TaskList';
import { AuthenticateUserRequest } from '../Model/request/AuthenticateUserRequest';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-project-tasks',
  standalone: true,
  imports: [MatCardModule,MatBadgeModule,MatFormFieldModule,MatIconModule,
    FormsModule, ReactiveFormsModule,MatInputModule,
    MatExpansionModule,MatChipsModule,CommonModule,FilterPipe],
  templateUrl: './project-tasks.component.html',
  styleUrl: './project-tasks.component.css',
})
export class ProjectTasksComponent implements OnInit {

  searchText : string = "";
  taskList : Task[];   
  taskListLength : number = 0;

  taskListResponse : TaskList;

  constructor(private router : Router,private taskService : TasksService, private authService : AuthService){
  }
  ngOnInit(): void {
    this.getOverAllTasksDetails(Number(sessionStorage.getItem('empId')),sessionStorage.getItem('devTag'));
  }

  editTask(taskId : number){
    this.router.navigate(['/addtask/'+taskId],{});
  }

  getOverAllTasksDetails(empId:number,devTag:string){
    let payload = new AuthenticateUserRequest();
    payload.empId = empId;
    payload.devTag = devTag;

    this.taskService.getOverallTaskDetails(payload).subscribe(
      (res) =>{
        this.taskListResponse = res;
        this.taskList = res.taskList;
        this.taskListLength = this.taskList.length;

        console.log(`Get overall task details : ${JSON.stringify(this.taskListResponse)}`);
      },
      (error)=>{
        console.log(`Error occured while retriving overall task details : ${JSON.stringify(error)}`);
        alert('Error occured while getching overall task details !');
      },
      () =>{
        console.log('Task details response end.');
      }
    );
  }

}
