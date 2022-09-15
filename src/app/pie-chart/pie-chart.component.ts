import { Component,ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";
import { Subscription } from 'rxjs';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { EmployeeService } from '../employee.service';
import { SimpleEmployee } from '../model/simpleEmployee';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnDestroy {

  @ViewChild("chart") chart: ChartComponent | any;
  public chartOptions: Partial<ChartOptions> | any;
  allEmployees : SimpleEmployee[] = [];
  subscription: Subscription;
  constructor(private employeeService: EmployeeService) {

  }

  ngOnInit(): void {
    this.subscription = this.employeeService.takeAllEmployees().subscribe(employees => {
      this.allEmployees = employees;
      let tempSeries: Array<number> = [];
      let tempLabels: Array<string> = [];
      this.allEmployees.forEach(elem => {
        tempSeries.push(elem.TotalTime);
        tempLabels.push(elem.EmployeeName);
        this.chartOptions = {
          series: tempSeries,
          chart: {
            width: 380,
            type: "pie"
          },
          labels: tempLabels,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        };
      });
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}

