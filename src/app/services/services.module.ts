import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
    UserService,
    HttpService,
    ErrorService,
    SiteService,
    AccessGuardGuard,
    UploadFileService
  } from './';

@NgModule({
    declarations: [],
    imports: [
      HttpClientModule,
      CommonModule
    ],
    providers: [
      UserService,
      HttpService,
      ErrorService,
      SiteService,
      UploadFileService,
      AccessGuardGuard
    ]
})

export class ServicesModule { }