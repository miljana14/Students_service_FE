import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';
import { Exam, ExaminationPeriod, Subject, Professor } from 'src/app/core/models';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbDateStruct, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HttpExamService } from 'src/app/core/services/http-exam.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-exam-form',
  templateUrl: './exam-form.component.html',
  styleUrls: ['./exam-form.component.css']
})
export class ExamFormComponent implements OnInit {

  examForm?: FormGroup;
  mode: string = '';
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  exam?: Exam;
  examinationPeriods: ExaminationPeriod[] = [];
  subjects: Subject[] = [];
  professors: Professor[] = [];
  dates: Date[] = [];
  private formSubscription?: Subscription;
  subsciptions = new Subscription();

  constructor(private fb: FormBuilder, private httpExam: HttpExamService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router, private httpExaminationPeriod: HttpExaminationPeriodService, private httpSubject: HttpSubjectService, private httpProfessor: HttpProfessorService, private calendar: NgbCalendar) {
    this.exam = this.activatedRoute.snapshot.data['examData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.loadExaminationPeriod();
    this.loadSubject();
    this.buildForm(this.exam);
    this.subscribeToFormChanges();
    if(this.exam){
    const examDateFromDatabase: Date = new Date(this.exam!.examDate); 
    const currentDate: NgbDateStruct = {
      year: examDateFromDatabase.getFullYear(),
      month: examDateFromDatabase.getMonth() + 1,
      day: examDateFromDatabase.getDate()
    };
    this.examForm?.get('examDate')?.setValue(currentDate);
  } 
   }

  ngOnInit(): void {
    if(this.id){
      this.availableDates();
      this.availableProfessors();
      
    }
  }

  ngOnDestroy() {
    this.formSubscription?.unsubscribe();
  }

  loadExaminationPeriod() {
    this.subsciptions.add(this.httpExaminationPeriod.getAllPresentOrFuture().subscribe(ep => this.examinationPeriods=ep));
  }

  loadSubject() {
    this.subsciptions.add(this.httpSubject.getAll().subscribe(s => this.subjects=s));
  }

  buildForm(exam?: Exam){
    this.examForm = this.fb.group({
  
      examinationPeriod:  this.fb.group({
        id: [exam?.examinationPeriod?.id],
        name: [exam?.examinationPeriod?.name, Validators.required],
        beginDate: [exam?.examinationPeriod?.beginDate,  Validators.required],
        endDate: [exam?.examinationPeriod?.endDate,  Validators.required],
        active: [exam?.examinationPeriod?.active, Validators.required],
    }),
      subject: this.fb.group({
        id: [exam?.subject?.id],
        name: [exam?.subject?.name, [Validators.required, Validators.minLength(3)]],
        description: [exam?.subject?.description],
        noOfESP: [exam?.subject?.noOfESP,  Validators.required],
        yearOfStudy: [exam?.subject?.yearOfStudy, [Validators.required, Validators.min(1), Validators.max(5)]],
        semester: [exam?.subject?.semester,  Validators.required]
  
      }),
      professor: this.fb.group({
        id:[exam?.professor?.id],
        firstName: [exam?.professor?.firstName,  [Validators.required, Validators.minLength(3)]],
        lastName: [exam?.professor?.lastName,  [Validators.required, Validators.minLength(3)]],
        email: [exam?.professor?.email, Validators.email],
        address: [exam?.professor?.address,  Validators.minLength(3)],
        postalCode: this.fb.group({
          postalCode: [exam?.professor?.postalCode.postalCode, [Validators.required]],
          name: [exam?.professor?.postalCode.name, [Validators.required]],
        }),
        phone: [exam?.professor?.phone, Validators.minLength(9)],
        reelectionDate: [exam?.professor?.reelectionDate, Validators.required],
        title: this.fb.group({
          id: [exam?.professor?.title.id, [Validators.required]],
          title: [exam?.professor?.title.title, [Validators.required]]
        }),
        subjects: [exam?.professor?.subjects],
        username: [exam?.professor?.username],
        password: [exam?.professor?.password, Validators.required]
      }),
      examDate: [exam?.examDate,  Validators.required],
    }, { validator: this.customExamValidator() });
  };

  subscribeToFormChanges() {
    this.examForm?.get('examinationPeriod')?.valueChanges
      .subscribe(() => {
        this.examForm?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this.customExamValidator(); 
      });

    this.examForm?.get('subject')?.valueChanges
      .subscribe(() => {
        this.examForm?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this.customExamValidator(); 
      });
  }

  customExamValidator() {
    const selectedExamPeriod = this.examForm?.get('examinationPeriod')?.get('id')?.value;
    const selectedSubject = this.examForm?.get('subject')?.get('id')?.value;

    if (selectedExamPeriod && selectedSubject) { 
      this.httpExam.getAll().pipe(
        map(exams => exams.find(exam =>
          exam.examinationPeriod.id === selectedExamPeriod &&
          exam.subject.id === selectedSubject
        ))
      ).subscribe(examExists => {
        if (examExists) {
          this.examForm?.get('subject')?.setErrors({ subjectHasExamInSelectedPeriod: true });
        } else {
          this.examForm?.get('subject')?.setErrors(null);
        }
      });
    }
  };

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.examForm?.get(componentName)?.dirty || this.examForm?.get(componentName)?.touched) &&
    ((!errorCode && this.examForm?.get(componentName)?.errors ) ||
    (errorCode && this.examForm?.get(componentName)?.hasError(errorCode)));
  }


  onSave(){
    const e =this.examForm?.getRawValue();
    const examDateNgbStruct: NgbDateStruct = this.examForm?.get('examDate')?.value;
    const examDateFormatted = `${examDateNgbStruct.year}-${this.numberFormat(examDateNgbStruct.month)}-${this.numberFormat(examDateNgbStruct.day)}`;
    e.examDate = examDateFormatted;
    if(this.id){
      this.httpExam.editExam(this.id, e).subscribe( () => {
        this.route.navigate(['/exam/exam-list']);
      });
    }else{
      this.httpExam.saveExam(e).subscribe( () => {
        this.route.navigate(['/exam/exam-list']);
      });
    }
  }

  private numberFormat(number: number): string {
    return number < 10 ? '0' + number : number.toString();
  }

  availableDates() {
    const examinationPeriodId = this.examForm?.get('examinationPeriod')?.get('id')?.value;
    this.examForm?.get('examDate')?.disable(); 

    this.dates = [];
    this.subsciptions.add(this.httpExam.availableDates(examinationPeriodId).subscribe(datesFromDatabase => {
      if (datesFromDatabase === undefined) {
        this.dates = []; 
        return;
      }

      const availableDatesFromDatabase: string[] = datesFromDatabase.map((date: any) => {
        return date;
      });

      for (const dateStr of availableDatesFromDatabase) {
       
        const dateParts = dateStr.split('-');
        const year: number = parseInt(dateParts[0], 10);
        const month: number = parseInt(dateParts[1], 10);
        const day: number = parseInt(dateParts[2], 10);

        const date: Date = new Date(year, month - 1, day); 
        this.dates.push(date);
      }
      this.examForm?.get('examDate')?.enable();
      this.getMinDate();
      this.getMaxDate();
   
    })); 
    return this.dates;
  }

  getMinDate(): NgbDate {
    if (this.dates.length === 0) {

      return this.calendar.getToday();
    }
    const minDate = this.dates.reduce((min, currentDate) => {
      return currentDate < min ? currentDate : min;
    }, this.dates[0]);
    return new NgbDate(
      minDate.getFullYear(),
      minDate.getMonth() + 1,
      minDate.getDate()
    );
  }

  getMaxDate(): NgbDate {
    if (this.dates.length === 0) {
    
      return this.calendar.getNext(this.calendar.getToday(), 'y', 10);
    }
    const maxDate = this.dates.reduce((max, currentDate) => {
      return currentDate > max ? currentDate : max;
    }, this.dates[0]);
    return new NgbDate(
      maxDate.getFullYear(),
      maxDate.getMonth() + 1,
      maxDate.getDate()
    );
  }
  
  availableProfessors() {
    const subject = this.examForm?.get('subject')?.get('id')?.value;  
    this.subsciptions.add(this.httpProfessor.availableProfessors(subject).subscribe(p =>this.professors = p));
  }
}

