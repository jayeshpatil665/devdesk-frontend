import {Pipe, PipeTransform} from '@angular/core';
import { Task } from './Model/response/Task';

@Pipe({
    name : 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform  {

    transform(items: Task[], searchText :string) : any[] {
        
        if(!items) return [];
        if(!searchText) return items;

        if(searchText.length>=3){
            //console.log('newList : ',items.filter((task:Task)=>task.tName.includes(searchText.toLocaleLowerCase())));
            return items.filter((task:Task)=>task.tName.toLowerCase().includes(searchText.toLocaleLowerCase()));
        }
        else{
            return items;
        }
    }
    
}