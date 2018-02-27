import { Component, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
@DestroySubscribers()
export class AssetsComponent implements OnInit {
  
  
  constructor() {
  }
  
  ngOnInit() {
  
  }
}