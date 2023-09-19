import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-global-toast',
  templateUrl: './global-toast.component.html',
  styleUrls: ['./global-toast.component.css']
})
export class GlobalToastComponent implements OnInit {

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
  }

  removeToast(index: number){
    this.toasts.splice(index, 1);
  }

  get toasts(){
    return this.toastService.toasts;
  }

}
