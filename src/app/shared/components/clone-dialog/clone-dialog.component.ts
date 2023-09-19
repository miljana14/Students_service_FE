import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfirmOption } from 'src/app/core/enums';
import { ExaminationPeriod } from 'src/app/core/models';
import { HttpExaminationPeriodService } from 'src/app/core/services/http-examination-period.service';

@Component({
  selector: 'app-clone-dialog',
  templateUrl: './clone-dialog.component.html',
  styleUrls: ['./clone-dialog.component.css']
})
export class CloneDialogComponent implements OnInit {

  @Input() headerText = '';
  message = '';
  examinationPeriodForm?: FormGroup;
  subsciptions = new Subscription();
  examinationPeriods: ExaminationPeriod[] = [];
  examinationPeriod?: ExaminationPeriod;
  selectedExaminationPeriodName?: string;

  @Output() cloneConfirmed = new EventEmitter<string>();

  constructor(private fb: FormBuilder, public modal: NgbActiveModal, private httpExaminationPeriod: HttpExaminationPeriodService, private route: Router) {
    this.buildForm(this.examinationPeriod);
  }

  ngOnInit(): void {
    this.loadExaminationPeriod();
  }

  handleExaminationPeriodChange(event: Event) {
    const selectedId = +(event.target as HTMLSelectElement).value;
    const selectedExaminationPeriod = this.examinationPeriods.find(ep => ep.id === selectedId);
    this.selectedExaminationPeriodName = selectedExaminationPeriod?.name;
  }

  onConfirm() {
    const e = this.examinationPeriodForm?.getRawValue();
    const selectedExaminationPeriodName = this.examinationPeriodForm?.get('name')?.value;
    const name = this.examinationPeriodForm?.get('newName')?.value;
    const examinationPeriodFormDateNgbStruct: NgbDateStruct = this.examinationPeriodForm?.get('beginDate')?.value;
    const examinationPeriodFormDateFormatted = `${examinationPeriodFormDateNgbStruct.year}-${this.numberFormat(examinationPeriodFormDateNgbStruct.month)}-${this.numberFormat(examinationPeriodFormDateNgbStruct.day)}`;
    e.beginDate = examinationPeriodFormDateFormatted;
    this.httpExaminationPeriod.examinationPeriodByClone(name, e.beginDate, selectedExaminationPeriodName).subscribe((newExaminationPeriod) => {
      const newId = newExaminationPeriod.id;
      this.route.navigate(['/examination-period/examination-period-details', newId]); this.modal.close();
      this.cloneConfirmed.emit();
    });


  }

  onCancel() {
    this.modal.close(ConfirmOption.CANCEL);
  }

  loadExaminationPeriod() {
    this.subsciptions.add(this.httpExaminationPeriod.getAll().subscribe(ep => this.examinationPeriods = ep));
  }

  buildForm(examinationPeriod?: ExaminationPeriod) {
    this.examinationPeriodForm = this.fb.group({
      id: [examinationPeriod?.id],
      name: [examinationPeriod?.name, Validators.required],
      newName: ['', Validators.required],
      beginDate: [null, Validators.required]
    }, { validators: [this.uniqueValidator, this.uniqueValidator]}
    )
  }

  uniqueValidator = (formGroup: FormGroup) => {
    const name = formGroup.get('newName')?.value;
  
    if (name) {
      this.httpExaminationPeriod.getAll().subscribe((examinationPeriods: ExaminationPeriod[]) => {
        let isNameUnique = true;
  
        examinationPeriods.forEach((ep: ExaminationPeriod) => {
          if (ep.name.toLowerCase() === name.toLowerCase()) {
            isNameUnique = false;
          }
        });
  
        if (!isNameUnique) {
          formGroup.get('newName')?.setErrors({ unavailable: true });
        }
      });
    }
  };

  overlappingDatesValidator = (formGroup: FormGroup) => {

    let beginDate = formGroup.get('beginDate')?.value;
    let epName = formGroup.get('name')?.value;
    let numberOfDaysToAdd: number;
   
    this.httpExaminationPeriod.getByName(epName).subscribe((ep) => {
      
      numberOfDaysToAdd= (ep.endDate!.getTime() - ep.beginDate!.getTime()) / (1000 * 60 * 60 * 24);
      console.log(numberOfDaysToAdd);
    });

    const examinationPeriodFormDateNgbStruct: NgbDateStruct = this.examinationPeriodForm?.get('beginDate')?.value;
    if (examinationPeriodFormDateNgbStruct) {
      const examinationPeriodFormDateFormatted = `${examinationPeriodFormDateNgbStruct.year}-${this.numberFormat(examinationPeriodFormDateNgbStruct.month)}-${this.numberFormat(examinationPeriodFormDateNgbStruct.day)}`;
      beginDate = examinationPeriodFormDateFormatted;
    }

    let endDate = new Date(beginDate.getTime() + numberOfDaysToAdd! * 24 * 60 * 60 * 1000);

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
        formGroup.get('beginDate')?.setErrors({ overlappingDates: true });
      }
    });
  };
}

  hasErrors(componentName: string, errorCode?: string) {
    return  (this.examinationPeriodForm?.get(componentName)?.dirty || this.examinationPeriodForm?.get(componentName)?.touched) &&
    ((!errorCode && this.examinationPeriodForm?.get(componentName)?.errors ) ||
    (errorCode && this.examinationPeriodForm?.get(componentName)?.hasError(errorCode)));
  }


  private numberFormat(number: number): string {
    if (typeof number === 'number') {
      return number < 10 ? '0' + number : number.toString();
    } else {
      return '';
    }
  }
}
