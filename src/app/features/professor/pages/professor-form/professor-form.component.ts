import { HttpSubjectService } from './../../../../core/services/http-subject.service';
import { HttpTitleService } from './../../../../core/services/http-title.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { City, Professor, Title, Subject } from 'src/app/core/models';
import { HttpCityService } from 'src/app/core/services/http-city.service';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { HttpUserService } from 'src/app/core/services/http-user.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { UserLoginDataService } from 'src/app/core/services/user-login-data.service';

@Component({
  selector: 'app-professor-form',
  templateUrl: './professor-form.component.html',
  styleUrls: ['./professor-form.component.css']
})
export class ProfessorFormComponent implements OnInit {

  professorForm?: FormGroup;
  mode: string = '';
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  professor?: Professor;
  cities: City[] = [];
  titles: Title[] = [];
  subjects: Subject[] = [];
  professorExists?: boolean;
  userAuthority: any = this.userLoginData?.userLoginData?.authorities[0].authority;
  subsciptions = new Subscription();


  constructor(private fb: FormBuilder, private httpProfessor: HttpProfessorService, private activatedRoute: ActivatedRoute, private userLoginData: UserLoginDataService, private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router, private httpCity: HttpCityService, private httpTitle: HttpTitleService, private httpSubject: HttpSubjectService, private httpUser: HttpUserService ) {
    this.professor = this.activatedRoute.snapshot.data['professorData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.loadCity();
    this.loadTitle();
    this.loadSubject();
    this.buildForm(this.professor);
    if(this.professor){
      const professorDateFromDatabase: Date = new Date(this.professor!.reelectionDate); 
      const currentDate: NgbDateStruct = {
        year: professorDateFromDatabase.getFullYear(),
        month: professorDateFromDatabase.getMonth() + 1,
        day: professorDateFromDatabase.getDate()
      };
      this.professorForm?.get('reelectionDate')?.setValue(currentDate);
    } 
   }

  ngOnInit(): void {
  }

  loadCity() {
    this.subsciptions.add(this.httpCity.getAll().subscribe(c => this.cities=c));
  }
  loadTitle() {
    this.subsciptions.add(this.httpTitle.getAll().subscribe(t => this.titles=t));
  }
  loadSubject() {
    this.subsciptions.add(this.httpSubject.getAll().subscribe(s => this.subjects=s));
  }


  buildForm(professor?: Professor){
    this.professorForm = this.fb.group({
      id:[professor?.id],
      firstName: [professor?.firstName,  [Validators.required, Validators.minLength(3)]],
      lastName: [professor?.lastName,  [Validators.required, Validators.minLength(3)]],
      email: [professor?.email, [Validators.required,Validators.email]],
      address: [professor?.address,  Validators.minLength(3)],
      postalCode: this.fb.group({
        postalCode: [professor?.postalCode.postalCode, [Validators.required]],
        name: [professor?.postalCode.name, [Validators.required]],
      }),
      phone: [professor?.phone, Validators.minLength(9)],
      reelectionDate: [professor?.reelectionDate, Validators.required],
      title: this.fb.group({
        id: [professor?.title.id, [Validators.required]],
        title: [professor?.title.title, [Validators.required]]
      }),
      subjects: [professor?.subjects],
      username: [professor?.username],
      password: [professor?.password, Validators.required],
      repeatedPassword: [professor?.password, Validators.required],
    }, { validators: [this.fieldsMatchValidator, this.validateUsername, this.validateEmail ]});

    if(professor){
      this.professorForm.get('email')?.disable();
      this.professorExists=true;
      this.professorForm.get('username')?.clearValidators();
      this.professorForm.get('password')?.clearValidators();
      this.professorForm.get('repeatedPassword')?.clearValidators();
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
    return  (this.professorForm?.get(componentName)?.dirty || this.professorForm?.get(componentName)?.touched) &&
    ((!errorCode && this.professorForm?.get(componentName)?.errors ) ||
    (errorCode && this.professorForm?.get(componentName)?.hasError(errorCode)));
  }

  onSave(){
    const p =this.professorForm?.getRawValue();
    const professorDateNgbStruct: NgbDateStruct = this.professorForm?.get('reelectionDate')?.value;
    const professorDateFormatted = `${professorDateNgbStruct.year}-${this.numberFormat(professorDateNgbStruct.month)}-${this.numberFormat(professorDateNgbStruct.day)}`;
    p.reelectionDate = professorDateFormatted;
    if(this.id){
      this.httpProfessor.editProfessor(this.id, p).subscribe( () => {
        if(this.userAuthority === "ROLE_ADMIN" ){
          this.route.navigate(['/professor/professor-list']);
        }else{
          this.route.navigate(['/home/home-professor']);
        }
      }
      );
    }else{
      this.httpProfessor.saveProfessor(p).subscribe( () => {
        if(this.userAuthority === "ROLE_ADMIN" ){
          this.route.navigate(['/professor/professor-list']);
        }else{
          this.route.navigate(['/home/home-professor']);
        }
      }
      );
    }
   }
   
   private numberFormat(number: number): string {
    return number < 10 ? '0' + number : number.toString();
  }

}
