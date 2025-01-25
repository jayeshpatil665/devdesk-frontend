import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProjectTasksComponent } from './project-tasks/project-tasks.component';
import { HomeComponent } from './home/home.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
    {
        path:'',component:DashboardComponent,
        children:[
            {
                path:'home',component:HomeComponent
            },
            {
                path:'tasks',component:TasksComponent
            },
            {
                path:'projecttasks',component:ProjectTasksComponent
            },
            {
                path:'addtask/:taskId',component:AddTaskComponent
            },
            {
                path:'about',component:AboutComponent
            }
        ]
    },
    {
        path:'login',component:LoginComponent
    },
    {
        path:'register',component:RegisterComponent
    },
    { path: '**', component:PageNotFoundComponent } // Fallback route  - PageNotFoundComponent
];
