import { GuestTableComponent } from './component/guest-table/guest-table.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestFormComponent } from './component/guest-form/guest-form.component';

const routes: Routes = [

  {path : '', component : GuestFormComponent},
  {path : 'guest', component : GuestTableComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
