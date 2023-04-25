import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './app.material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NotFoundComponent } from './components/not-found/not-found.component';
import { CollegeDashboardComponent } from './components/college-dashboard/college-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    CollegeDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
