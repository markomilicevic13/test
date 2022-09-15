import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HashTable } from 'angular-hashtable';
import { EmployeeService } from '../employee.service';
import { Employee } from '../model/employee';
import { SimpleEmployee } from '../model/simpleEmployee';



@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css']
})
export class AllEmployeesComponent implements OnInit {

  constructor(private employeeService: EmployeeService, private router: Router) { }

  //Hash table where key is employee name, and value is total time
  hashTableAllEmployees = new HashTable<string, any>();
  tempAllEmployees : Array<SimpleEmployee> = [];
  allEmployees:Array<Employee> = [];


  //Starting example for testing before getting data from url
  exampleForAllEmployees:Array<Employee> = [
    {"Id":"25768d9f-502a-4776-8796-c26d76d6a6eb","EmployeeName":"Abhay Singh","StarTimeUtc":"2022-02-22T14:15:00","EndTimeUtc":"2022-02-22T12:01:00","EntryNotes":"working on project Take-Two Interactive","DeletedOn":null},
    {"Id":"77e4bfce-5b1b-4103-8ae0-5e22a96fe6f4","EmployeeName":"Tamoy Smith","StarTimeUtc":"2022-02-21T09:42:00","EndTimeUtc":"2022-02-21T10:43:00","EntryNotes":"analyzing ticket in Towers Perrin","DeletedOn":null},
    {"Id":"ac9cc343-083c-45bf-9058-9a73d15b76f7","EmployeeName":"Mary Poppins","StarTimeUtc":"2022-02-23T12:40:00","EndTimeUtc":"2022-02-23T16:26:00","EntryNotes":"debugging issue in THQ","DeletedOn":null},
    {"Id":"f5ff7946-1eb4-413b-902c-6f315b6b18fb","EmployeeName":"Mary Poppins","StarTimeUtc":"2022-02-05T07:40:00","EndTimeUtc":"2022-02-05T08:33:00","EntryNotes":"reviewing patch for Shure","DeletedOn":null}
  ]

  calculateTotalTimeInMonthForEachEmployee(list: Array<Employee>){
    list.forEach(elem =>{
      let hours = this.calculateTimeSpent(elem.StarTimeUtc, elem.EndTimeUtc);
      this.addTime(elem.EmployeeName, hours);
    })
  }

  //This function add time spent in work for one employee
  addTime(EmployeeName: string, time: number){
    if(EmployeeName == null) return;                  //If somebody didnt write their name
    if(!this.hashTableAllEmployees.has(EmployeeName)){
      this.hashTableAllEmployees.put(EmployeeName, { TotalTime: time });
    }else{
      let temp = this.hashTableAllEmployees.get(EmployeeName);
      temp.TotalTime = temp.TotalTime + time;
      this.hashTableAllEmployees.put(EmployeeName, { TotalTime: temp.TotalTime });
    }
  }

  //This function calculate hours spent in one work day
  calculateTimeSpent(dateStart: string, dateEnd: string): number{
    let newDateStart = new Date(dateStart);
    let newDateEnd = new Date(dateEnd);
    if(newDateStart > newDateEnd) return 0;            //If start time is after end time
    var Time = newDateEnd.getTime() - newDateStart.getTime();
    var Hours = Time / (1000 * 3600);
    return Hours;
  }

  ngOnInit(): void {
    //Getting all employees from url
    this.employeeService.getAllEmployees().subscribe(( response)=>{
      this.allEmployees = response;
      this.calculateTotalTimeInMonthForEachEmployee(this.allEmployees);
      //Converting hash table into array because *ngFor cant work with hash table
      this.hashTableAllEmployees.forEach((key: string, value: any) => {
        this.tempAllEmployees.push({EmployeeName: key,TotalTime: value.TotalTime});
      })
      this.tempAllEmployees.sort(function (a, b) {
        return b.TotalTime - a.TotalTime;
      });
      this.employeeService.saveAllEmployees(this.tempAllEmployees);
    });

  }

  editEmployee(){
    //TODO
  }
}
