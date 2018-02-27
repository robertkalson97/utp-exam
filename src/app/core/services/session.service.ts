import { Injectable } from '@angular/core';

import { LocalStorage } from 'angular2-local-storage/local_storage';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class SessionService {
  public session: any = {};
  
  constructor(
      public localStorage: LocalStorage,
      public cookieService: CookieService
  ) {
  }

  set(title, value){
    try{
      this.localStorage.set(title, value);
    } catch(err){
      if (!this.cookieService.put(title, value)) {
        this.session[title] = value;
      }
    }
  }

  get(title){
    let value;
    try{
      value =  this.localStorage.get(title);
      this.localStorage.set('uptracker_temp', 'temp');
    } catch(err){
      value = this.cookieService.get(title) || this.session[title];
    }
    // weird bug in LocalStorage component
    return (value != "undefined") ? value : undefined;
  }

  remove(title){
    try{
      this.localStorage.remove(title);
      this.localStorage.set('uptracker_temp', 'temp');
    } catch(err){
      if (!this.cookieService.remove(title)){
        this.session[title] = null;
      }
    }
  }

  setLocal(key, value){
    try{
      this.localStorage.set('uptracker_'+key, value);
    } catch(err){
    }
  }

  getLocal(key){
    return this.localStorage.get('uptracker_'+key);
  }

  removeLocal(key){
    this.localStorage.remove('uptracker_'+key);
  }
  
}
