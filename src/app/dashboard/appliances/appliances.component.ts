import { Component, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';


@Component({
  selector: 'app-appliances',
  templateUrl: './appliances.component.html',
  styleUrls: ['./appliances.component.scss']
})
@DestroySubscribers()
export class AppliancesComponent implements OnInit {
  
  
  constructor() {
  }
  
  ngOnInit() {
  
  }
}