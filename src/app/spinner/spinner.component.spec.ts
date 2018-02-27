/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { SpinnerComponent } from "./spinner.component";
import { AppSharedModule } from "../shared/shared.module";
import { SpinnerService } from "../core/services/spinner.service";



describe('Component: SpinnerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpinnerComponent
      ],
      imports: [
        AppSharedModule,
      ],
      providers: [
        SpinnerService
      ]
    });
  });

  it('should create an spinner component', fakeAsync(inject([TestBed],(testBed) => {
    let fixture = testBed.createComponent(SpinnerComponent);
    let component = fixture.debugElement.componentInstance;
    component.ngOnInit();
    tick();
    expect(component).toBeTruthy();
  })));

  it('should change spinner isLoading', fakeAsync(inject([TestBed],(testBed) => {
    let fixture = testBed.createComponent(SpinnerComponent);
    let component = fixture.debugElement.componentInstance;
    component.ngOnInit();
    tick();
    component.toggleLoadingIndicator(true);
    expect(component.isLoading).toBeTruthy();
    component.toggleLoadingIndicator(false);
    expect(component.isLoading).toBeFalsy();
  })));

});
