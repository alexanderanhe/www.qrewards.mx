import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { LegalsComponent } from './legals/legals.component';
import { FaqComponent } from './faq/faq.component';


const routes: Routes = [
  { path: 'code', component: AuthComponent },
  { path: 'access-link/:tkn/:rid', component: AuthComponent },
  { path: 'aviso-de-privacidad', component: LegalsComponent },
  { path: 'preguntas-frecuentes', component: FaqComponent },
  { path: '**', component: NopagefoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
