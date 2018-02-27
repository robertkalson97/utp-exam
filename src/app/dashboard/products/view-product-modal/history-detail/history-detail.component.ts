import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';


export class ViewProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-history-detail',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
@DestroySubscribers()
export class HistoryDetailComponent implements OnInit, AfterViewInit {
  public received_approved_by: any;
  
  @Input("order") public order;

  constructor() {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }

  variantDetailCollapse() {
    this.order.detailView = false;
  }
}
