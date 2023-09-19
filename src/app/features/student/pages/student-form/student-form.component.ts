import { City } from './../../../../core/models/city.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/core/models';
import { HttpStudentService } from 'src/app/core/services/http-student.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HttpCityService } from 'src/app/core/services/http-city.service';
import { Subscription } from 'rxjs';
import { HttpUserService } from 'src/app/core/services/http-user.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  studentForm?: FormGroup;
  mode: string = '';
  indexNumber = this.activatedRoute.snapshot.paramMap.get('indexNumber');
  indexYear = Number(this.activatedRoute.snapshot.paramMap.get('indexYear'));
  student?: Student;
  cities: City[] = [];
  studentExists?: boolean;
  subsciptions = new Subscription();
  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;

  constructor(private fb: FormBuilder, private httpStudent: HttpStudentService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private translateService: TranslateService, private userLoginData: UserLoginDataService, private toastService: ToastService, private route: Router, private httpCity: HttpCityService, private httpUser: HttpUserService) {
    this.student = this.activatedRoute.snapshot.data['studentData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.loadCity();
    this.buildForm(this.student);
   }

  ngOnInit(): void {
  }

  loadCity() {
    this.subsciptions.add(this.httpCity.getAll().subscribe(c => this.cities=c));
  }

  buildForm(student?: Student){
    this.studentForm = this.fb.group({
      indexNumber: [student?.indexNumber, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
      indexYear: [student?.indexYear, [Validators.required, Validators.min(2000), Validators.max(2100)]],
      firstName: [student?.firstName,  [Validators.required, Validators.minLength(3)]],
      lastName: [student?.lastName,  [Validators.required, Validators.minLength(3)]],
      email: [student?.email, [Validators.required, Validators.email]],
      address: [student?.address,  [Validators.required, Validators.minLength(3)]],
      postalCode: this.fb.group({
        postalCode: [student?.postalCode?.postalCode, [Validators.required]],
        name: [student?.postalCode?.name, [Validators.required]]
      }),
      currentYearOfStudy: [student?.currentYearOfStudy, [Validators.required, Validators.min(1), Validators.max(5)]],
      username: [student?.username],
      password: [student?.password, Validators.required],
      repeatedPassword: [student?.password, Validators.required],
    }, { validators: [this.fieldsMatchValidator, this.validateUsername, this.validateEmail ]});

    if(student){
      this.studentForm.get('indexNumber')?.disable();
      this.studentForm.get('indexYear')?.disable();
      this.studentForm.get('email')?.disable();
      this.studentExists=true;
      this.studentForm.get('username')?.clearValidators();
      this.studentForm.get('password')?.clearValidators();
      this.studentForm.get('repeatedPassword')?.clearValidators();
    }
  }

  fieldsMatchValidator = (formGroup: FormGroup) => {
    const password = formGroup.get('password')?.value;
    const repeatedPassword = formGroup.get('repeatedPassword')?.value;
  
    if (password !== repeatedPassword) {
      formGroup.get('repeatedPassword')?.setErrors({ fieldsMismatch: true });
    } 
  };

  validateUsername = (formGroup: FormGroup) => {
    const username = formGroup.get('username')?.value;
  
    this.httpUser.getAll().subscribe((users) => {
      const user = users.find((user) => user.username === username);
      if (user) {
        formGroup.get('username')?.setErrors({ invalidCredentials: true });
      } else {
        formGroup.get('username')?.setErrors(null);
      }
    });
  };

  validateEmail = (formGroup: FormGroup) => {
    const email = formGroup.get('email')?.value;
  
    this.httpUser.getAll().subscribe((users) => {
      const user = users.find((user) => user.email === email);
      if (user) {
        formGroup.get('email')?.setErrors({ invalidCredentials: true });
      } else {
        formGroup.get('email')?.setErrors(null);
      }
    });
  };

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.studentForm?.get(componentName)?.dirty || this.studentForm?.get(componentName)?.touched) &&
    ((!errorCode && this.studentForm?.get(componentName)?.errors ) ||
    (errorCode && this.studentForm?.get(componentName)?.hasError(errorCode)));
  }


  onSave(){
    const s =this.studentForm?.getRawValue();  
    if(this.indexNumber && this.indexYear){
      this.httpStudent.editStudent(this.indexNumber!, this.indexYear, s).subscribe(() => {
        if(this.userAuthority === "ROLE_ADMIN" ){
          this.route.navigate(['/student/student-list']);
        }else{
          this.route.navigate(['/home/home-student']);
        }
      });
    }else{
      this.httpStudent.saveStudent(s).subscribe(() => {
        if(this.userAuthority === "ROLE_ADMIN" ){
          this.route.navigate(['/student/student-list']);
        }else{
          this.route.navigate(['/home/home-student']);
        }
      });
    }
   }

}
