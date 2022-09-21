import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/model/employee';
import { DataService } from 'src/app/service/data.service';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})

export class AddEmployeeComponent implements OnInit {

  public employee: Employee = new Employee();
  public employeeFormGroup: FormGroup;

  departments: Array<any> = [
    {
      id: 1,
      name: "HR",
      value: "HR",
      checked: false
    },
    {
      id: 2,
      name: "Sales",
      value: "Sales",
      checked: false
    },
    {
      id: 3,
      name: "Finance",
      value: "Finance",
      checked: false
    },
    {
      id: 4,
      name: "Engineer",
      value: "Engineer",
      checked: false
    },
    {
      id: 5,
      name: "Other",
      value: "Other",
      checked: false
    }
  ]

  constructor(private formBuilder: FormBuilder, private httpService: HttpService, private router: Router, private activatedRoute: ActivatedRoute, private dataService: DataService) {
    this.employeeFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      profilePic: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      departments: this.formBuilder.array([], [Validators.required]),
      salary: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      note: new FormControl('', [Validators.required])
    })
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['employeeId'] != undefined) {
      this.dataService.currentEmployee.subscribe(employee => {
        if (Object.keys(employee).length !== 0) {
          console.log(employee);
          this.employeeFormGroup?.get('name')?.setValue(employee.name);
          this.employeeFormGroup?.get('profilePic')?.setValue(employee.profilePic);
          this.employeeFormGroup?.get('gender')?.setValue(employee.gender);
          this.employeeFormGroup?.get('salary')?.setValue(employee.salary);
          this.employeeFormGroup?.get('startDate')?.setValue(employee.startDate);
          this.employeeFormGroup?.get('note')?.setValue(employee.note);

        }
      });
    }
  }

  onCheckboxChange(event: MatCheckboxChange) {
    const departments: FormArray = this.employeeFormGroup.get('departments') as FormArray;

    if (event.checked) {
      departments.push(new FormControl(event.source.value));
      console.log(departments);
    } else {
      const index = departments.controls.findIndex(x => x.value === event.source.value);
      departments.removeAt(index);
    }
  }

  salary: number = 400000;
  updateSetting(event: any) {
    this.salary = event.value;
  }

  onSubmit() {
    this.employee = this.employeeFormGroup.value;
    if (this.activatedRoute.snapshot.params['employeeId'] != undefined) {
      this.httpService.updateEmployee(this.activatedRoute.snapshot.params['employeeId'], this.employee).subscribe(response => {
        console.log(response);
        this.ngOnInit();
        this.router.navigateByUrl("/home-page");
      });
    } else {
      this.httpService.addEmployee(this.employee).subscribe(response => {
        console.log(response);
        this.router.navigateByUrl("/home-page");
      });
    }
  }
}

