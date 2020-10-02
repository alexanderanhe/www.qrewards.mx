import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService, SiteService } from '../../services';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  client: string = 'qrewards';
  site: any;
  user: User;
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
    this.user = this._userService.user;
  }

  validation( form: NgForm ) {
    let msg: string = '';

    if (!/^[a-zA-Z-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(form.value.name) || !form.value.name) {
      msg += '\n-\tEl campo nombre es incorrecto ó esta vacío';
    }

    if (!/^[a-zA-Z-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(form.value.lastname) || !form.value.lastname) {
      msg += '\n-\tEl campo apellido es incorrecto ó esta vacío';
    }

    if (!/^[a-zA-Z-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(form.value.mun) || !form.value.mun) {
      msg += '\n-\tEl campo municipio es incorrecto ó esta vacío';
    }

    if (!/^[a-zA-Z-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(form.value.state) || !form.value.state) {
      msg += '\n-\tEl campo estado es incorrecto ó esta vacío';
    }

    if (!form.value.email) {
      msg += '\n-\tCorreo electrónico está vacío';
    } else if (form.value.email != form.value.email_confirm) {
      msg += '\n-\tCorreo de confirmación no coincide';
    } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.value.email)) {
      msg += '\n-\tCorreo electrónico incorrecto';
    }

    if (msg) {
      swal('Verifique datos!', msg, 'info');
      return true;
    }

    return false;

  }


  register( form: NgForm ) {
    this.loadingRequest = true;
    if (form.invalid || this.validation(form) ) {
      this.loadingRequest = false;
      return;
    }


    this._userService.updateRecordUser({
      client: this.client,
      name: [form.value.name, form.value.lastname].join(' '),
      info: {
        name: form.value.name,
        lastname: form.value.lastname,
        town: form.value.mun,
        state: form.value.state
      },
      email: form.value.email
    })
      .subscribe(
        success => {
          console.log(this.user.digital.type);
          const download_page = this.user.digital.type !== 'rchrg';
          this.router.navigate([download_page ? '/download' : '/carrier']);
        },
        err => {
          this.loadingRequest = false;
        }
      );
  }

}
