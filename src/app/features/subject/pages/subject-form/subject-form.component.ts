import { SemesterOption } from './../../../../core/enums/enums';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { Subject } from 'src/app/core/models';
import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css']
})
export class SubjectFormComponent implements OnInit {

  subjectForm?: FormGroup;
  mode: string = '';
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  subject?: Subject;
  semesters = SemesterOption;

  subsciptions = new Subscription();

  constructor(private fb: FormBuilder, private httpSubject: HttpSubjectService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router) {
    this.subject = this.activatedRoute.snapshot.data['subjectData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.buildForm(this.subject);
   }

  ngOnInit(): void {
  }

  buildForm(subject?: Subject){
    this.subjectForm = this.fb.group({
      id: [subject?.id],
      name: [subject?.name, [Validators.required, Validators.minLength(3)]],
      description: [subject?.description],
      noOfESP: [subject?.noOfESP,  Validators.required],
      yearOfStudy: [subject?.yearOfStudy, [Validators.required, Validators.min(1), Validators.max(5)]],
      semester: [subject?.semester,  Validators.required]

    })
  }

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.subjectForm?.get(componentName)?.dirty || this.subjectForm?.get(componentName)?.touched) &&
    ((!errorCode && this.subjectForm?.get(componentName)?.errors ) ||
    (errorCode && this.subjectForm?.get(componentName)?.hasError(errorCode)));
  }


  onSave(){
    const s =this.subjectForm?.getRawValue();
    if(this.id){
      this.httpSubject.editSubject(this.id, s).subscribe(() => {
        this.route.navigate(['/subject/subject-list']);
      });
    }else{
      this.httpSubject.saveSubject(s).subscribe(() => {
        this.route.navigate(['/subject/subject-list']);
      });
    }
   }

}
