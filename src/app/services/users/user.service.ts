import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Record } from 'src/app/models/record.model';
import { Digital } from 'src/app/models/digital.model';
import { API_URL } from '../../config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert';
import { map, retry, catchError } from 'rxjs/operators';
import { ErrorService } from '../errors/error.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;
  digital: Digital;
  token: string;
  httpOptions: any;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _error: ErrorService
  ) {
    this.loadLocalStorage();
  }

  isLogged() {
    return !!this.token;
  }

  authCode( code: string, site: any, params: any ) {
    let url = API_URL + ['/sites', site.slug, 'auth', encodeURIComponent(code)].join('/');
    let userLS: User;

    if (params) {
      url = url + '?' + Object.entries(params).map(e => e.join('=')).join('&');
    }
    return this.http.get( url )
      .pipe(
        map ( (resp: any) => {
          userLS = resp.data.user;
          this.saveLocalStorage(resp.data.token, userLS);
        }),
        catchError( this._error.showErrors )
      );
  }

  logout() {
    // const url = API_URL + '/admin/logout';
    // return this.http.get( url, this.httpOptions )
    // .pipe(
    //   map ( (resp: any) => {
    //     return resp.data;
    //   })
    // )
    // .subscribe(
    //   success => console.log('Sesión terminada correctamente'),
    //   err => console.error('Ocurrio un error al cerrar sesión!'),
    //   () => {
        this.removeLocalStorage();
        this.router.navigate(['/code']);
    //   }
    // );
  }

  loadLocalStorage(prefix: string = '') {
    if ( localStorage.getItem('token') ) {
      try {
        const userLS = JSON.parse(localStorage.getItem([prefix, 'user'].join('')));
        this.digital = userLS.digital;
        this.token = localStorage.getItem([prefix, 'token'].join(''));
        this.httpOptions = {
          headers: new HttpHeaders({
            'X-API-KEY': this.token
          })
        };
        this.user = userLS;
      } catch (error) {
        this.token = '';
        this.user = null;
        swal('Error', 'Algo pasó!', 'error');
      }
    } else {
      this.token = '';
      this.user = null;
    }
  }

  removeLocalStorage(prefix: string = '') {
    this.user = null;
    this.token = null;
    localStorage.removeItem([prefix, 'user'].join(''));
    localStorage.removeItem([prefix, 'token'].join(''));
  }

  saveLocalStorage( token: string = null, user: User, prefix: string = '') {
    if (token) {
      localStorage.setItem([prefix, 'token'].join(''), token );
    } else {
      token = this.token;
    }
    if (user) {
      localStorage.setItem([prefix, 'user'].join(''), JSON.stringify(user) );
    }
    this.httpOptions = {
      headers: new HttpHeaders({
        'X-API-KEY': token
      })
    };

    this.user = user;
    this.token = token;
  }

  updateRecordUser( params: any) {
    let url = API_URL + '/sites/record';

    return this.http.put( url, params, this.httpOptions )
      .pipe(
        map ( (resp: any) => {
          const data = resp.data.rows;
          this.user.record.name = data.name;
          this.user.record.email = data.email;
          this.user.record.info = data.info;
          this.saveLocalStorage(this.token, this.user);
        }),
        catchError( this._error.showErrors )
      );
  }

}
