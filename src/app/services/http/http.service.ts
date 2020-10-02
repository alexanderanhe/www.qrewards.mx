import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { API_URL } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public _userService: UserService
  ) { }

  getStockValid(params: any) {
    let url = API_URL + '/admin/checkout/stock';
    if (params) {
      url = url + '?' + Object.entries(params).map(e => e.join('=')).join('&');
    }
    return this.http.get ( url, this._userService.httpOptions )
    .pipe (
      map ( ( resp: any) => {
        return resp.data;
      }),
      catchError( this._userService._error.showErrors )
    );

  }

  updatePromoPicture( params: any ) {
    const url = API_URL + '/admin/promo_picture';
    return this.http.put( url, params, this._userService.httpOptions )
      .pipe(
        map ( (resp: any) => {
          if (!resp.data) {
            throw new Error("Error occurred.");
          }
          return resp.data;
        }),
        catchError( this._userService._error.showErrors )
      );
  }
}
