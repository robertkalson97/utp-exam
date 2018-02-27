/* tslint:disable:no-unused-variable */
import "materialize-css";
import "angular2-materialize";
import { DashboardComponent } from './dashboard.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '../app.module';
import { APP_BASE_HREF } from '@angular/common';
import { DashboardModule } from './dashboard.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Dashboard', () => {
  
  let fixture: ComponentFixture<DashboardComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  
  
  beforeEach(() => {
      TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        AppModule,
        DashboardModule,
        RouterTestingModule
      ],
  
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
      ],
    });
  });
  
  it('Should contain the left nav menu button dashboard', () => {
    fixture = TestBed.createComponent(DashboardComponent);
    de = fixture.debugElement.query( By.css('aside > div.nav') );
    el = de.children[0].nativeElement;
    expect(el.textContent).toContain('Dashboard');
  });
  
  it('Should contain the left nav menu button shopping list', () => {
    fixture = TestBed.createComponent(DashboardComponent);
    de = fixture.debugElement.query( By.css('aside > div.nav') );
    el = de.children[1].nativeElement;
    expect(el.textContent).toContain('Shopping List');
  });
  
  
});
