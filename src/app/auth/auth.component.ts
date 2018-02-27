import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { StateService } from '../core/services/index';

@Component({
  selector: 'app-auth',
  styleUrls: [ './auth.style.scss' ],
  templateUrl: './auth.template.html'
})
export class AuthComponent implements OnInit {
  public showUserMenu$: Observable<boolean>;

  constructor(
      public stateService: StateService,
      public router: Router
  ) {
  }

  ngOnInit(){
    this.showUserMenu$ = this.router.events.map(res =>{
      return this.stateService.arrIsPartUrl(['email-verification', 'about-company', 'payment-info', 'signup/congrats']);
    });
  }
}
