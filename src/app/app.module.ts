import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuestFormComponent } from './component/guest-form/guest-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GuestTableComponent } from './component/guest-table/guest-table.component';
import { GuestTablePipe } from './component/guest-table/guest-table.pipe';
import { GuestDetailComponent } from './component/guest-detail/guest-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    GuestFormComponent,
    GuestTableComponent,
    GuestTablePipe,
    GuestDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
