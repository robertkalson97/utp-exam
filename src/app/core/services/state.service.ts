import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {Observable} from "rxjs";

@Injectable()
export class StateService {
  url: string;
  navigationEndUrl: string = '';
  public navigationEndUrl$: Observable<any>;

  
  constructor(
    public router: Router,
  ) {
    this.navigationEndUrl$ =  router.events
        .filter(event => event instanceof NavigationEnd)
        .map((event: any) => event.url);

    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        this.navigationEndUrl = event.url;
      });
  }

  isUrl(url){
    return this.navigationEndUrl == url;
  }
  
  isNotUrl(url){
    return !this.isUrl(url);
  }
  
  isPartUrl(part) {
    let re = new RegExp(part, 'gi');
    return this.navigationEndUrl.search(re) >= 0;
  }
  
  arrIsPartUrl(arr: any = []) {
    let re: RegExp;
    let self = this;
    let j = 0;
    arr.forEach((part, i, arr) => {
      if (self.isPartUrl(part)) {
        j++;
      }
    });
    return j > 0;
  }

}
