import { NgModule } from "@angular/core";
import { RegisterComponent } from './register/register.component';
import { CarrierComponent } from './carrier/carrier.component';
import { DownloadComponent } from './download/download.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
    declarations: [
        PagesComponent,
        RegisterComponent,
        CarrierComponent,
        DownloadComponent
    ],
    exports: [
        PagesComponent
    ],
    imports: [
        BrowserModule,
        PagesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        PipesModule
    ]
})

export class PagesModule { }