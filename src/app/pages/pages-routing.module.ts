import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { PagesComponent } from './pages.component';
import { CarrierComponent } from './carrier/carrier.component';
import { DownloadComponent } from './download/download.component';
import { AccessGuardGuard } from '../services/guards/access-guard.guard';

const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [ AccessGuardGuard ],
    children: [
        { path: 'register', component: RegisterComponent, data: { title: 'Registra tus datos' }},
        { path: 'carrier', component: CarrierComponent, data: { title: 'Recarga telefónica' }},
        { path: 'download', component: DownloadComponent, data: { title: 'Descarga tu recompensa' }},
        { path: '', redirectTo: '/code', pathMatch: 'full' }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
