import { Component, OnDestroy, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

@Component({
  selector: 'app-home-tab',
  templateUrl: './home-tab.component.html',
  styleUrls: ['./home-tab.component.scss'],
})
@DestroySubscribers()
export class HomeTabComponent implements OnInit, OnDestroy {
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
