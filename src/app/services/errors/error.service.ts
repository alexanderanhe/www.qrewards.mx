import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import swal from 'sweetalert';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  showErrors(err: HttpErrorResponse) {
    if (err.error.error) {
      swal('Error', err.error.error.description, 'error'); // has error
    } else if (err.error.description) {
      swal('Error', err.error.description, 'error'); // has error
    } else {
      swal('Error', 'Ocurrio un error', 'error'); // has error
    }
    // return throwError(err.statusText);
    return Observable.throw(err.statusText);
  }
}
