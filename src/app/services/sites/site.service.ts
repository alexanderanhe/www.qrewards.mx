import { Injectable } from '@angular/core';
import { UserService } from '../users/user.service';
import { API_URL } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(
    public http: HttpClient,
    public _userService: UserService
  ) { }

  getSiteInfo(slug) {
    const url = API_URL + ['/sites', slug, 'info'].join('/');
    return this.http.get ( url)
    .pipe (
      map ( ( resp: any) => {
        return resp.data;
      }),
      catchError( this._userService._error.showErrors )
    );
  }

  downloadCodes(slug, params: any = null) {
    let url = API_URL + ['/sites', slug, 'download'].join('/');
    if (params) {
      url = url + '?' + Object.entries(params).map(e => e.join('=')).join('&');
    }
    return this.http.get ( url, this._userService.httpOptions)
    .pipe (
      map ( ( resp: any) => {
        return resp.data;
      }),
      catchError( this._userService._error.showErrors )
    );
  }
}
