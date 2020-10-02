import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService, SiteService } from '../services';
// import { User } from '../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: []
})
export class AuthComponent implements OnInit {

  client: string = 'qrewards';
  site: any;
  recaptcha: string;
  // fields
  code: string;
  conditions: boolean;
  loadingRequest: boolean;

  constructor(
    public router: Router,
    public _userService: UserService,
    public _siteService: SiteService
  ) { }

  ngOnInit(): void {
    this._siteService.getSiteInfo(this.client)
      .subscribe(resp => {
        this.site = resp;
      });
      // this._userService.removeLocalStorage();
      console.log('Should removeLocalStorage');
   }

  validation( form: NgForm ) {
    let msg: string = '';
    if (!form.value.code || form.value.code.length <= 7 ) {
      msg += '\n-\tCódigo incompleto o inválido.';
    }

    if (!this.recaptcha) {
      msg += '\n-\tCaptcha no verificado.';
    }

    if (!form.value.conditions) {
      msg += '\n-\tDebe aceptar los términos y condiciones.';
    }

    if (msg) {
      swal('Verifique datos!', msg, 'info');
      return true;
    }
    return false;
  }

  oauth( form: NgForm ) {
    this.loadingRequest = true;
    if (form.invalid || this.validation(form) ) {
      this.loadingRequest = false;
      return;
    }

    this._userService.authCode(form.value.code, this.site, {
      'g-recaptcha-response': this.recaptcha,
      conditions: form.value.conditions
    })
      .subscribe(
        success => {
          this.router.navigate(['/register']);
        },
        err => {
          this.loadingRequest = false;
          this.code = '';
          grecaptcha.reset();
        }
      );
  }

  resolveRecaptcha(captchaResponse: string) {
    this.recaptcha = captchaResponse;
  }

}
