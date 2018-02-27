import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { validateConfig } from '@angular/router/src/config';


export class ViewProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-inventory-detail',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
@DestroySubscribers()
export class InventoryDetailComponent implements OnInit, AfterViewInit {

  @Input("variant") public variant;
  @Input("vis") public vis;
  @Input("currentLocation") public currentLocation;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  
}
