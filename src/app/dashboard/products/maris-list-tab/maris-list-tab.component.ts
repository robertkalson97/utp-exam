import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

@Component({
  selector: 'app-maris-list-tab',
  templateUrl: './maris-list-tab.component.html',
  styleUrls: ['./maris-list-tab.component.scss'],
})
@DestroySubscribers()
export class MarisListTabComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  constructor(
  
  ) {
  
  }
  
  ngOnInit() {
  
  }
  
  addSubscribers() {
  
  }
  
  ngOnDestroy() {
  
  }
  
}
