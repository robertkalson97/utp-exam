import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';

import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { ModalWindowService } from '../../../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';
import { AccountService } from '../../../../core/services/account.service';


export class ViewProductModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-variant-detail',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './variant-short-detail.component.html',
  styleUrls: ['./variant-short-detail.component.scss']
})
@DestroySubscribers()
export class VariantShortDetailComponent implements OnInit, AfterViewInit {
  public locationArr: any;
  
  @Input("variant") public variant;
  @Input("product_id") public product_id;
  @Input("showEdit") public showEdit;

  constructor(
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public accountService: AccountService,

) {
    this.accountService.locations$
    .subscribe(r=>{this.locationArr = r});
  
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
  
  log(p){
    console.log(p);
  }
 
}
