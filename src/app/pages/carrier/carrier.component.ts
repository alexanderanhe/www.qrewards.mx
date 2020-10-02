import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService, SiteService } from '../../services';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-carrier',
  templateUrl: './carrier.component.html',
  styleUrls: ['./carrier.component.sass']
})
export class CarrierComponent implements OnInit {

  client: string = 'qrewards';
  site: any;
  user: User;
  carrier: string= '';
  carriers: any = [];
  rchrg_message: any;
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
    if (this.user.options) {
      if (this.user.options.carriers) {
        this.carriers = this.user.options.carriers;
      }
    }
    // if (!this.carriers) {
    //   this.carriers = ['telcel', 'movistar', 'ina', 'unefon', 'virgin'];
    // }
  }

  selCarrier(carrier: string) {
    this.carrier = carrier;
  }

  errorMessage() {
    swal('Error!', 'Hubo un error con su recarga, revise sus datos y vuelva a intentarlo más tarde.', 'error');
    this.loadingRequest = false;
  }

  validation( form: NgForm) {
    let msg: string = '';
    if (!form.value.company) {
      msg += '\n-\tNo se ha seleccionado ninguna compañía.';
    }

    if (!form.value.cellphone) {
      msg += '\n-\tTeléfono está vacio.';
    }
    else if (!/^[0-9]{10}$/.test(form.value.cellphone)) {
      msg += '\n-\tTeléfono incorrecto.';
    } 
    else if (form.value.cellphone != form.value.cellphone_confirm) {
      msg += '\n-\tTelefono de confirmación no coincide.';
    }

    if (msg) {
      swal('Verifique datos!', msg, 'info');
      return true;
    }
    return false;
  }

  rechargeEject( form: NgForm ) {
    this.loadingRequest = true;
    if (form.invalid || this.validation(form) ) {
      this.loadingRequest = false;
      return;
    }

    this._userService.updateRecordUser({
      client: this.client,
      telephone: form.value.cellphone,
      info: {
        cellphone: form.value.cellphone,
        cellphone_company: form.value.company
      }
    })
      .subscribe(
        success => {
          this._siteService.downloadCodes(this.client, {
            rchrg_cellphone: form.value.cellphone,
            rchrg_company: form.value.company
          })
            .subscribe(
              req => {
                if (req) {
                    if (req.sources.recharges.length) {
                        if (req.sources.recharges[0]) {
                          swal('Proceso exitoso', 'Tu recarga se registro exitosamente', 'success') // has error
                            .then(() => {
                              this.rchrg_message = req.sources.recharges[0];
                              this.loadingRequest = false;
                            });
                        } else this.errorMessage();
                    } else this.errorMessage();
                } else this.errorMessage();
              },
              err => {}
            );
        },
        err => {}
      );
  }

}
