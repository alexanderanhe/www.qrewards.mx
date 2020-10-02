import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService, SiteService } from '../../services';
import { User } from 'src/app/models/user.model';
import { PDF_URL } from '../../config/config';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['../pages.component.scss']
})
export class DownloadComponent implements OnInit, AfterViewInit {

  client: string = 'qrewards';
  site: any;
  user: User;
  descr_type: string = '';
  media_url: string;
  pageLoading: boolean;

  constructor(
    public router: Router,
    public _userService: UserService,
    public _siteService: SiteService,
    public sanitizer: DomSanitizer
  ) {
    this.pageLoading = true;
    this._siteService.getSiteInfo(this.client)
      .subscribe(resp => {
        this.site = resp;
        this.pageLoading = false;
      });
  }

  ngOnInit(): void {
    this._userService.loadLocalStorage();
  }

  ngAfterViewInit() {
    this.user = this._userService.user;
    if (this._userService.digital) {
      this.descr_type = this._userService.digital.name.indexOf('STARBUCKS') === 0 ? 'sbk' : '';
    }
  }

  download() {
    this._siteService.downloadCodes(this.client)
      .subscribe(
        req => {
          let d = new Date();
          let url_coupon = [PDF_URL, 'dompdf.php?i[]=' + req.sources.media.join('&i[]=')].join('/') + '&ts=' + d.getTime().toString() ;
          console.log(url_coupon);
          if (req.device_os_mobile) {
            window.location.replace(url_coupon);
          } else {
            this.media_url = url_coupon;
          }
        },
        err => {}
      );
  }

}
