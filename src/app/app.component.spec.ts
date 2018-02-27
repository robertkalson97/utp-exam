/* tslint:disable:no-unused-variable */
import "materialize-css";
import "angular2-materialize";


import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppSharedModule } from './shared/shared.module';
import { routing } from './app.routing';
import { SpinnerModule } from './spinner/spinner.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OnboardModule } from './onboard/onboard.module';
import { NoContentModule } from './no-content/no-content.module';
import { ModalModule } from 'angular2-modal';
import { CoreModule } from './core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';


describe('App: FrontendUptracker', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        //routing,
        ModalModule.forRoot(),
        AppSharedModule,
        CoreModule,
        RouterTestingModule,
        DashboardModule,
        OnboardModule,
        AuthModule,
        NoContentModule,
        SpinnerModule
      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}],
    });
  });
  
  it('Should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  
  it('Should create the spinner component', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement;
    expect(app.children[1].name).toEqual("app-spinner");
  }));

  it('Should create the router-outlet component', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement;
    expect(app.children[2].name).toEqual("router-outlet");
    //it('true is true', () => expect(true).toBe(true));

  }));



});
