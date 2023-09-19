import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmOption } from 'src/app/core/enums';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  @Input() headerText = '';
  message = '';

  constructor(public modal : NgbActiveModal) { }

  ngOnInit(): void {
  }

  onConfirm(){
    this.modal.close(ConfirmOption.OK);
  }

  onCancel(){
    this.modal.close(ConfirmOption.CANCEL);
  }

}
