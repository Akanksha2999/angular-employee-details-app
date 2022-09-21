import { Component, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';
import { HttpService } from 'src/app/service/http.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-home-page',
  template: '<app-add-employee [employeeData]="employee"></app-add-employee>',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  public employees: Employee[] = [];

  constructor(private httpService: HttpService, private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.httpService.getEmployeeData().subscribe(data => {
      this.employees = data.data;
      console.log(this.employees);
    });
  }

  remove(employeeId: number): void {
    console.log(employeeId)
    alert('Delete employee with id:' + employeeId + '?')
    this.httpService.deleteEmployee(employeeId).subscribe(response => {
      console.log(response)
      this.ngOnInit();
    });
  }

  update(employee: Employee): void {
    alert('Update employee details with id:' + employee.employeeId + '?')
    this.dataService.changeEmployee(employee);
    this.router.navigateByUrl('/add-employee/' + employee.employeeId);
    this.httpService.updateEmployee(employee.employeeId, employee).subscribe(response => {
      console.log(response);
      this.ngOnInit();
    });
  }
}





