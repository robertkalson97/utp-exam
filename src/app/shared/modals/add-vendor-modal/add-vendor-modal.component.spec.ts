import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVendorModalComponent } from './add-vendor-modal.component';

describe('AddVendorModalComponent', () => {
  let component: AddVendorModalComponent;
  let fixture: ComponentFixture<AddVendorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddVendorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVendorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
