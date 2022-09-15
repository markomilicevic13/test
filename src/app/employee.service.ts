import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from './model/employee';
import { SimpleEmployee } from './model/simpleEmployee';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  allEmployees : Subject<SimpleEmployee[]> = new Subject<SimpleEmployee[]>();

  saveAllEmployees(list: Array<SimpleEmployee>){  //This function is for getting data from all-employees.component
    this.allEmployees.next(list);
  }
  takeAllEmployees(){
    return this.allEmployees.asObservable();          //This function sends allEmployees to pie-chart.component
  }


  getAllEmployees(){
    return this.http.get<Employee[]>('https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=vO17RnE8vuzXzPJo5eaLLjXjmRW07law99QTD90zat9FfOQJKKUcgQ==');
  }
}
