// import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { routing }  from './app.routing';
import { AppComponent } from './app.component';

// modules
import { CoreModule } from './core/core.module';
import { NoContentModule } from './no-content/no-content.module';
import { AuthModule } from './auth/auth.module';
import { SpinnerModule } from './spinner/spinner.module';
import { AppSharedModule } from './shared/shared.module';
import { ModalModule } from 'angular2-modal';
import { DashboardModule } from './dashboard/dashboard.module';
import { OnboardModule } from './onboard/onboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ModalModule.forRoot(),
    AppSharedModule,
    // BrowserModule,
    CoreModule,
    routing,

    DashboardModule,
    OnboardModule,
    AuthModule,
    NoContentModule,
    SpinnerModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
