import { Injectable } from '@angular/core';
import { ToastMessage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: ToastMessage[] = [];

  constructor() { }

  showToast(message: ToastMessage){
    this.toasts.push(message);
  }
}
