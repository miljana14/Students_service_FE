import { BooleanValues, ConfirmOption } from './../../../../core/enums/enums';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ExaminationPeriod } from 'src/app/core/models';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { CloneDialogComponent } from 'src/app/shared/components/clone-dialog/clone-dialog.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-examination-period-form',
  templateUrl: './examination-period-form.component.html',
  styleUrls: ['./examination-period-form.component.css']
})
export class ExaminationPeriodFormComponent implements OnInit {

  examinationPeriodForm?: FormGroup;
  mode: string = '';
  id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  examinationPeriod?: ExaminationPeriod;
  actives = BooleanValues;
  examinationPeriods: ExaminationPeriod[] = [];

  subsciptions = new Subscription();

  constructor(private fb: FormBuilder, private httpExaminationPeriod: HttpExaminationPeriodService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private translateService: TranslateService, private toastService: ToastService, private route: Router) {
    this.examinationPeriod = this.activatedRoute.snapshot.data['examinationPeriodData'];
    this.mode = this.activatedRoute.snapshot.data['mode'];
    this.buildForm(this.examinationPeriod);
    if(this.examinationPeriod){
      const examinationPeriodDateFromDatabase: Date = new Date(this.examinationPeriod!.beginDate); 
      const examinationPeriodDateFromDatabaseEnd: Date = new Date(this.examinationPeriod!.endDate);
      const currentDate: NgbDateStruct = {
        year: examinationPeriodDateFromDatabase.getFullYear(),
        month: examinationPeriodDateFromDatabase.getMonth() + 1,
        day: examinationPeriodDateFromDatabase.getDate()
      };
      const currentDateEnd: NgbDateStruct = {
        year: examinationPeriodDateFromDatabaseEnd.getFullYear(),
        month: examinationPeriodDateFromDatabaseEnd.getMonth() + 1,
        day: examinationPeriodDateFromDatabaseEnd.getDate()
      };
      this.examinationPeriodForm?.get('beginDate')?.setValue(currentDate);
      this.examinationPeriodForm?.get('endDate')?.setValue(currentDateEnd);
    } 
   }

  ngOnInit(): void {
  }

  getAll() {
    this.subsciptions.add(this.httpExaminationPeriod.getAll().subscribe((examinationPeriods: ExaminationPeriod[]) => {
      this.examinationPeriods = examinationPeriods;
    }));
  }

  buildForm(examinationPeriod?: ExaminationPeriod){
    this.examinationPeriodForm = this.fb.group({
      id: [examinationPeriod?.id],
      name: [examinationPeriod?.name, Validators.required],
      beginDate: [examinationPeriod?.beginDate,  Validators.required],
      endDate: [examinationPeriod?.endDate,  Validators.required],
      active: [examinationPeriod?.active, Validators.required],
    }, { validators: [this.uniqueValidator, this. dateRangeValidator, this.overlappingDatesValidator, this.checkBeginDateIsBeforeEndDate ]});
    if(examinationPeriod){
      this.examinationPeriodForm.get('name')?.disable();
      this.examinationPeriodForm.get('beginDate')?.disable();
      this.examinationPeriodForm.get('endDate')?.disable();
    }else{
      this.examinationPeriodForm.get('active')?.disable();
    }
  }

  
  uniqueValidator = (formGroup: FormGroup) => {
    const name = formGroup.get('name')?.value;
  
    if (name) {
      this.httpExaminationPeriod.getAll().subscribe((examinationPeriods: ExaminationPeriod[]) => {
        let isNameUnique = true;
  
        examinationPeriods.forEach((ep: ExaminationPeriod) => {
          if (ep.name.toLowerCase() === name.toLowerCase()) {
            isNameUnique = false;
          }
        });
  
        if (!isNameUnique) {
          formGroup.get('name')?.setErrors({ unavailable: true });
        }
      });
    }
  };

  dateRangeValidator= (formGroup: FormGroup) => {
    let beginDate = formGroup.get('beginDate')?.value;
    let endDate = formGroup.get('endDate')?.value;
  
    const examinationPeriodFormDateNgbStruct: NgbDateStruct = this.examinationPeriodForm?.get('beginDate')?.value;
    if (examinationPeriodFormDateNgbStruct) {
      const examinationPeriodFormDateFormatted = `${examinationPeriodFormDateNgbStruct.year}-${this.numberFormat(examinationPeriodFormDateNgbStruct.month)}-${this.numberFormat(examinationPeriodFormDateNgbStruct.day)}`;
      beginDate = examinationPeriodFormDateFormatted;
    }
    const examinationPeriodDateNgbStructEnd: NgbDateStruct = this.examinationPeriodForm?.get('endDate')?.value;
    if (examinationPeriodDateNgbStructEnd) {
      const examinationPeriodFormDateFormattedEnd = `${examinationPeriodDateNgbStructEnd.year}-${this.numberFormat(examinationPeriodDateNgbStructEnd.month)}-${this.numberFormat(examinationPeriodDateNgbStructEnd.day)}`;
      endDate = examinationPeriodFormDateFormattedEnd;
    }
    if (beginDate && endDate && beginDate <= endDate) {
      return null;
    }
  
    return { dateRange: true };
  }
  
  overlappingDatesValidator = (formGroup: FormGroup) => {

      let beginDate = formGroup.get('beginDate')?.value;
      let endDate = formGroup.get('endDate')?.value;

      const examinationPeriodFormDateNgbStruct: NgbDateStruct = this.examinationPeriodForm?.get('beginDate')?.value;
      if (examinationPeriodFormDateNgbStruct) {
        const examinationPeriodFormDateFormatted = `${examinationPeriodFormDateNgbStruct.year}-${this.numberFormat(examinationPeriodFormDateNgbStruct.month)}-${this.numberFormat(examinationPeriodFormDateNgbStruct.day)}`;
        beginDate = examinationPeriodFormDateFormatted;
      }

      const examinationPeriodDateNgbStructEnd: NgbDateStruct = this.examinationPeriodForm?.get('endDate')?.value;
      if(examinationPeriodDateNgbStructEnd){
        const examinationPeriodFormDateFormattedEnd = `${examinationPeriodDateNgbStructEnd.year}-${this.numberFormat(examinationPeriodDateNgbStructEnd.month)}-${this.numberFormat(examinationPeriodDateNgbStructEnd.day)}`;
        endDate = examinationPeriodFormDateFormattedEnd;
      }
      if (beginDate && endDate) {
        this.httpExaminationPeriod.getAll().subscribe((examinationPeriods: ExaminationPeriod[]) => {
        let isOverlapping = false;
  
        examinationPeriods.forEach(ep => {
          if (examinationPeriods.some(ep => {
            return ep.beginDate <=endDate && ep.endDate >= beginDate;
          })) {
            isOverlapping = true;
          }
        });
  
        if (isOverlapping) {
          formGroup.get('endDate')?.setErrors({ overlappingDates: true });
        }
      });
    };
  }

  checkBeginDateIsBeforeEndDate = (formGroup: FormGroup) => {

    let beginDate = formGroup.get('beginDate')?.value;
    let endDate = formGroup.get('endDate')?.value;

    const examinationPeriodFormDateNgbStruct: NgbDateStruct = this.examinationPeriodForm?.get('beginDate')?.value;
    if (examinationPeriodFormDateNgbStruct) {
      const examinationPeriodFormDateFormatted = `${examinationPeriodFormDateNgbStruct.year}-${this.numberFormat(examinationPeriodFormDateNgbStruct.month)}-${this.numberFormat(examinationPeriodFormDateNgbStruct.day)}`;
      beginDate = examinationPeriodFormDateFormatted;
    }

    const examinationPeriodDateNgbStructEnd: NgbDateStruct = this.examinationPeriodForm?.get('endDate')?.value;
    if(examinationPeriodDateNgbStructEnd){
      const examinationPeriodFormDateFormattedEnd = `${examinationPeriodDateNgbStructEnd.year}-${this.numberFormat(examinationPeriodDateNgbStructEnd.month)}-${this.numberFormat(examinationPeriodDateNgbStructEnd.day)}`;
      endDate = examinationPeriodFormDateFormattedEnd;
    }

    if (beginDate >= endDate) {
      formGroup.get('endDate')?.setErrors({ orderDates: true });
    }
  }

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.examinationPeriodForm?.get(componentName)?.dirty || this.examinationPeriodForm?.get(componentName)?.touched) &&
    ((!errorCode && this.examinationPeriodForm?.get(componentName)?.errors ) ||
    (errorCode && this.examinationPeriodForm?.get(componentName)?.hasError(errorCode)));
  }


  onSave(){
    const e =this.examinationPeriodForm?.getRawValue();
    const examinationPeriodFormDateNgbStruct: NgbDateStruct = this.examinationPeriodForm?.get('beginDate')?.value;
    const examinationPeriodFormDateFormatted = `${examinationPeriodFormDateNgbStruct.year}-${this.numberFormat(examinationPeriodFormDateNgbStruct.month)}-${this.numberFormat(examinationPeriodFormDateNgbStruct.day)}`;
    e.beginDate = examinationPeriodFormDateFormatted;

    const professorDateNgbStructEnd: NgbDateStruct = this.examinationPeriodForm?.get('endDate')?.value;
    const examinationPeriodFormDateFormattedEnd = `${professorDateNgbStructEnd.year}-${this.numberFormat(professorDateNgbStructEnd.month)}-${this.numberFormat(professorDateNgbStructEnd.day)}`;
    e.endDate = examinationPeriodFormDateFormattedEnd;
    
    if(this.mode === 'EDIT'){
      this.httpExaminationPeriod.updateExaminationPeriod(this.id, e).subscribe( () => {
        this.route.navigate(['/examination-period/examination-period-list']);
      });
      
    }else{
      this.httpExaminationPeriod.saveExaminationPeriod(e).subscribe( () => {
        this.route.navigate(['/examination-period/examination-period-list']);
      });
    }
   }

   private numberFormat(number: number): string {
    if (typeof number === 'number') {
      return number < 10 ? '0' + number : number.toString();
    } else {
      return '';
    }
  }
  
  
  onClone(){
    const modalRef = this.modalService.open(CloneDialogComponent);
    modalRef.componentInstance.message = this.translateService.instant('COMMON.EXAMINATION_NAME');
    modalRef.componentInstance.headerText = this.translateService.instant('COMMON.CLONE_CONFIRM_DIALOG.TITLE', {entityName: 'examinationPeriod'});
    modalRef.componentInstance.cloneConfirmed.subscribe(() => {
       console.log("success")
    });
  }
}
