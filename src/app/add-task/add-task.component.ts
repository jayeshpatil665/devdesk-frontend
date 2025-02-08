import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { DatePipe, JsonPipe } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonResponse } from '../Model/response/CommonResponse';
import { Task } from '../Model/response/Task';
import { NewTask } from '../Model/request/NewTask';
import { TasksService } from '../services/TasksService/tasks.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { SpecificTaskDetailsRequest } from '../Model/request/SpecificTaskDetailsRequest';
import { AuthService } from '../services/AuthService/auth.service';
import { TaskPickedBy } from '../Model/response/TaskPickedBy';
import {MatRadioModule} from '@angular/material/radio';

import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

export interface Tag {
  name: string;
}

/*
export interface TaskPickedBy {
  empId : number;
  name : string;
}*/

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [MatCardModule,MatFormFieldModule,MatChipsModule,MatIconModule,MatInputModule,MatTooltipModule,MatSelectModule,
    MatDatepickerModule,MatNativeDateModule,FormsModule, ReactiveFormsModule, JsonPipe,
    MatChipsModule, MatIconModule,MatSnackBarModule,MatRadioModule,CommonModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
  providers:[DatePipe,provideNativeDateAdapter()],
})
export class AddTaskComponent implements OnInit{

  newTask = new NewTask();

  cardTitle : string = 'Add / Update Task';
  addTaskDBResponse : CommonResponse;
  speciftTask : Task;

  //flags to display /hide buttons
  updateTaskFlag : boolean;
  addTaskFlag : boolean;

  //start & end date
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  tempTask = new NewTask;
  passedTaskId : number;

  selectedOption : number[] = [];
  taskPickedBy : TaskPickedBy[] = [];

  userAssignTask : FormGroup = new FormGroup({});

  addUpdateTaskForm = new FormGroup({
    taskid : new FormControl({value:0,disabled:true}),
    tasktitle : new FormControl('',[Validators.required]),
    taskemail : new FormControl(),
    taskdetails : new FormControl('',[Validators.required]),
    tasksoln : new FormControl('',[Validators.required]),
    taskclient : new FormControl('',[Validators.required]),
    taskpriority : new FormControl(1,[Validators.required]),
    taskpool : new FormControl(0,[Validators.required]),
    taskstatus : new FormControl(0,[Validators.required])
  });

  ngOnInit(): void {
    this.passedTaskId = this.activatedRoute.snapshot.params['taskId'];
    console.log('Passed Task Id : ',this.passedTaskId);

    //setting username List
    //console.log('setting users in constructor');
    let obj =  JSON.parse(sessionStorage.getItem('usersList'));// this.authService.usersList;

    //console.log('userNames From service : ',this.authService.usersList);
    //console.log('userNames[] : ',obj);

    for (let index = 0; index < obj.length; index++) {
      const element = obj[index];
      this.taskPickedBy.push(element);
      //console.log('element : ',element);
    }

    if(this.passedTaskId == 0){
      this.updateTaskFlag = false;
      this.addTaskFlag = true;
      this.tempTask.tId = this.passedTaskId;
      this.cardTitle = 'Add Task';
      this.openSnackBar('Add Task Tab opened !','X');
    }
    else{
      this.updateTaskFlag = true;
      this.addTaskFlag = false;
      this.tempTask.tId = this.passedTaskId;
      this.cardTitle = 'Update Task';
      this.openSnackBar('Update Task Tab opened !','X');

      this.getSpecificTaskDetails();
    }

  }

  constructor(private activatedRoute : ActivatedRoute,private formBuilder : FormBuilder,private taskService : TasksService,private _snackBar: MatSnackBar,private router : Router,private authService : AuthService){
    
      this.userAssignTask = formBuilder.group({
        taskPickedBy: [this.selectedOption, [Validators.required]],
      })
  }

  /*Chips----*/
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: Tag[] = [];

  announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our Tag
    if (value) {
      this.tags.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  edit(tag: Tag, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit existing tag
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index].name = value;
    }
  }
  //Task Tag code end ---------------------------

  

  addNewTaks(){
    //console.log('Getting overall selected items : ',this.getSelectedItems());

    //console.log('add Task Button pressed : ',this.addUpdateTaskForm.value);
    //console.log('passed TaskId : ',this.passedTaskId);
    
    this.newTask.tClient = this.addUpdateTaskForm.value.taskclient;
    this.newTask.tEmail = this.addUpdateTaskForm.value.taskemail;
    this.newTask.tId = this.passedTaskId;
    this.newTask.tInfo = this.addUpdateTaskForm.value.taskdetails;
    this.newTask.tName = this.addUpdateTaskForm.value.tasktitle;
   
    this.newTask.tPool = this.addUpdateTaskForm.value.taskpool;
    this.newTask.tStatus = this.addUpdateTaskForm.value.taskstatus;
    this.newTask.tPriority = this.addUpdateTaskForm.value.taskpriority;
    //newTask.tReportDate
    //newTask.tResolutionDate

    
    this.newTask.tReportDate = this.formattedStartDate;
    this.newTask.tResolutionDate = this.formattedEndDate;
    this.newTask.tSolution = this.addUpdateTaskForm.value.tasksoln;
    
    let chipsString : string='';
    for(let chip of this.tags)
        chipsString+=chip.name+'~';

    this.newTask.tTags = chipsString.substring(0,chipsString.length-1);

    //console.log('map : ',this.getSelectedMap());
    //this.newTask.tPickedBy = this.taskPickedBy;

    /*console.log('new Task Object created : ',this.newTask);
    console.log('final task picked by list : ',this.taskPickedBy);
    console.log('Value Changes : ',this.taskPickedBy.values);
    console.log('-----=====');

    this.taskPickedBy.forEach((item, index) => {
      console.log(`-Item at index ${index}:`, item);
    });*/
    this.newTask.tPickedBy = this.getSelectedItemsAsString();
    

    this.taskService.addUpdateTask(this.newTask).subscribe(
      (resp:CommonResponse)=>{
          console.log('Add update task response recieved ',resp);
          if(resp.status ==="SUCCESS"){
            this.openSnackBar('task added/upadted succcesfully','_/');
            this.router.navigate(['/projecttasks']);
          }
          else if(resp.status ==="FAILURE"){
            this.openSnackBar('Unable to add/update task !','X');
          }
      },
      (error)=>{
          console.log('Error occured while adding updating task !');
          this.openSnackBar('error occured, Unable to add/update task !','X');
      },
      ()=>{
        console.log('Add update task finally block');
      }
    );
  }

  

  getSelectedMap(): Map<string, number> {
    return new Map(this.taskPickedBy.map(item => [item.name, item.empId]));
  }

  get formattedStartDate(): string {
    const start = this.range.value.start;
    return start instanceof Date ? this.correctDate(start) : 'Invalid date'; // start.toISOString().split('T')[0] : 'Invalid date';
  }

  get formattedEndDate(): string {
    const end = this.range.value.end;
    return end instanceof Date ? this.correctDate(end) : 'Invalid date'; //end.toISOString().split('T')[0] : 'Invalid date';
  }

  private correctDate(date: Date): string {
    // Correct the date by accounting for timezone offset
    const correctedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    // Format the corrected date to 'YYYY-MM-DD'
    return correctedDate.toISOString().split('T')[0];
  }


    // Handle checkbox change
    onCheckboxChange(event: any, key: number): void {
      if (event.target.checked) {
        this.selectedOption.push(key);
      } else {
        this.selectedOption = this.selectedOption.filter(k => k !== key);
      }
    }
    // Prepare selected items
    getSelectedItems() {
      return this.taskPickedBy.filter(item => this.selectedOption.includes(item.empId));
    }

    // Convert selected items to Map<string, number> format
    getSelectedItemsAsMap(): Map<string, number> {
      const map = new Map<string, number>();
      this.taskPickedBy.forEach(item => {
        if (this.selectedOption.includes(item.empId)) {
          map.set(item.name, item.empId);
        }
      });
      return map;
    }

  getSelectedItemsAsString(): string {
    let response : string; //2169860:Jayesh:Patil
    const map = new Map<string, number>();
    this.taskPickedBy.forEach(item => {
      if (this.selectedOption.includes(item.empId)) {
        map.set(item.name, item.empId);
        response+=item.empId+":"+item.name+"~";
      }
    });

    return response;
  }

  getSpecificTaskDetails() {
    let payload = new SpecificTaskDetailsRequest();
    payload.empId = Number(sessionStorage.getItem('empId'));
    payload.devTag =sessionStorage.getItem('devTag');
    payload.tId = this.passedTaskId;

    this.taskService.getSpecificTaskDetails(payload).subscribe(
      (res)=>{
        console.log('specific task response recieved : ',res);
        this.speciftTask = res.taskList.at(0);

        this.addUpdateTaskForm.setValue({
          taskid : this.speciftTask.tId,
          tasktitle : this.speciftTask.tName,
          taskemail : this.speciftTask.tEmail,
          taskdetails : this.speciftTask.tInfo,
          tasksoln : this.speciftTask.tSolution,
          taskclient : this.speciftTask.tClient,
          taskpriority : this.speciftTask.tPriority,
          taskpool : this.speciftTask.tPool,
          taskstatus : this.speciftTask.tStatus
        });

        this.newTask.tPool = this.speciftTask.tPool;
        this.newTask.tPriority = this.speciftTask.tPriority;
        this.newTask.tStatus = this.speciftTask.tStatus;

        /*this.range.patchValue({
          start : this.speciftTask.tReportDate,
          end : this.speciftTask.tResolutionDate,
        });*/

        this.range.setValue({
          start: new Date(this.speciftTask.tReportDate),
          end: new Date(this.speciftTask.tResolutionDate)
        });
        //this.range.value.start = this.speciftTask.tReportDate;
        //this.range.value.end = this.speciftTask.tResolutionDate;

        for(let taskTag of this.speciftTask.tTag){
          this.tags.push({name: taskTag});
        }

        let tempObj : Map<string,number> = this.speciftTask.tPickedBy;
        //console.log('tempObj : ',tempObj);
        
        for(const [key, value] of Object.entries(tempObj)){
          //console.log(key,value)

          this.selectedOption.push(value);
          //this.taskPickedBy.push({empId:value,name:key});
        }

        this.userAssignTask.get('taskPickedBy')?.setValue(this.selectedOption);
        //console.log('selectedTasks option : ',this.selectedOption);
      },
      (error)=>{
          console.log('Error occured while fetching specific task details : ',JSON.stringify(error));
      },
      ()=>{
        console.log('specific task fetch request complete.');
      }
    );
  }

  fixTimezoneOffset(date: Date): Date {
    const localDate = new Date(date);
    return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  }

  get f(){
    return this.userAssignTask.controls;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message,action,{
      horizontalPosition : 'end',
      verticalPosition : 'bottom',
      duration : 3*1000,
    });
  }


}
