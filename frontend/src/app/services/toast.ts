import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Toast {
  toast: any;
  show(message: string) {
    alert(message); // abhi simple
  }
 
}
