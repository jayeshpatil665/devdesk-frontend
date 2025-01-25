import { Component, OnInit } from '@angular/core';
import { Task } from '../Model/response/Task';

import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import { Router } from '@angular/router';
import { AuthService } from '../services/AuthService/auth.service';
import { TasksService } from '../services/TasksService/tasks.service';
import { FilteredDataRequest } from '../Model/request/FilteredDataRequest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MatCardModule,MatBadgeModule,MatIconModule,MatChipsModule,MatExpansionModule,CommonModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit{

  //taskListResponse : TaskList
  taskListAssignedToMe : Task[]; taskListAssignedToMeLength:number=0;
  taskListInProgress : Task[]; taskListInProgressLength:number=0;
  taskListCompleted : Task[]; taskListCompletedLength:number=0;

  constructor(private router: Router,private authService: AuthService,private taskService : TasksService){
    this.getFilteredTaskAssignedToMe(0);
    this.getFilteredTaskAssignedToMe(1);
    this.getFilteredTaskAssignedToMe(2);
  }
  ngOnInit(): void {
    
  }

  getFilteredTaskAssignedToMe(taskStatus : number) {
    let payload = new FilteredDataRequest();
    payload.empId = this.authService.empId;
    payload.devTag = this.authService.devTag;
    payload.taskStatus = taskStatus;
    payload.clientName = 'all';
    payload.taskType = 'personal';

    this.taskService.getFilteredTaskDetails(payload).subscribe(
      (resp)=>{
        if(taskStatus==0){
          console.log('fetching task assigned to me ',resp);
          this.taskListAssignedToMe = resp.taskList;
          this.taskListAssignedToMeLength = this.taskListAssignedToMe.length;
        }
        else if(taskStatus==1){
          console.log('fetching task in progress  ',resp);
          this.taskListInProgress = resp.taskList;
          this.taskListInProgressLength = this.taskListInProgress.length;
        }
        else if(taskStatus==2){
          console.log('fetching task assigned to me ',resp);
          this.taskListCompleted = resp.taskList;
          this.taskListCompletedLength = this.taskListCompleted.length;
        }

      },
      (error)=>{
        console.log('Error while retriving task list ',error);
      },
      ()=>{
        console.log('tasks loading completed');
      }
    );

  }

  editTask(taskId : number){
    this.router.navigate(['/addtask/'+taskId],{});
  }

}
