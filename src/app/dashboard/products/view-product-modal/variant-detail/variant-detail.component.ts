import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';


export class ViewProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-variant-detail',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './variant-detail.component.html',
  styleUrls: ['./variant-detail.component.scss']
})
export class VariantDetailComponent implements OnInit, AfterViewInit {

  @Input("variant") public variant;
  @Input("showEdit") public showEdit;

  constructor() {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  toggleVariantVisibility(variant) {
    variant.status = variant.status == 2 ? variant.status =1 : variant.status = 2;
  }

  variantDetailCollapse() {
    this.variant.detailView = false;
  }
}
