import { HttpSubjectService } from 'src/app/core/services/http-subject.service';
import { HttpProfessorService } from 'src/app/core/services/http-professor.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Professor, Subject } from 'src/app/core/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.css']
})
export class AddSubjectComponent implements OnInit {

  subjectForm? : FormGroup;
  professorId?: number;
  professor?: Professor;
  subjects : Subject[] = [];


  subsciptions = new Subscription();

  constructor(private activeRoute: ActivatedRoute,
    private httpProfessor: HttpProfessorService,
    private router: Router,
    private fb: FormBuilder,
    private httpSubject : HttpSubjectService) { }

     ngOnInit(): void {
      this.professorId = Number(this.activeRoute.parent?.snapshot.paramMap.get('id'));
      this.subsciptions.add(this.httpSubject.getAllSubjectsProfessorDontHave(this.professorId).subscribe(s => this.subjects=s));
      
        this.buildForm();
      }

     buildForm(subject?: Subject){
      this.subjectForm = this.fb.group({
        selectedSubjects: [[]]

      })

      if(subject){
        this.subjectForm.get('selectedSubjects')?.disable();
      }
    }

    hasErrors(componentName: string, errorCode?: string) {
      return  (this.subjectForm?.get(componentName)?.dirty || this.subjectForm?.get(componentName)?.touched) &&
      ((!errorCode && this.subjectForm?.get(componentName)?.errors ) ||
      (errorCode && this.subjectForm?.get(componentName)?.hasError(errorCode)));
    }

    onSave(){
      const selectedSubjects = this.subjectForm?.get('selectedSubjects')?.value;
        this.professorId = Number(this.activeRoute.parent?.snapshot.paramMap.get('id'));
        this.httpProfessor.addSubjectsToProfessor(this.professorId, selectedSubjects).subscribe();
        window.location.reload();
     }

}
