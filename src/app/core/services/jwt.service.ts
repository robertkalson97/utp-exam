import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

  constructor(
  ) {
  }

  tokenExpired(token){
    let date = this.getTokenExpirationDate(token);
    if (date == null) {
      return false;
    }
    // Token expired?
    return !(date.valueOf() > new Date().valueOf());
  }

  decodeJwtToken(token){
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return (JSON.parse(window.atob(base64)))
  }

  getTokenExpirationDate (token) {
    var decoded;
    decoded = this.decodeJwtToken(token);
    if (!decoded.hasOwnProperty('exp')) {
      return null;
    }
    var date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);
    return date;
  }
}
