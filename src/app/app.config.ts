import { InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { SessionService, SpinnerService, ToasterService, JwtService } from './core/services/index';
import { APP_DI_CONFIG } from '../../env';

export let APP_CONFIG = new InjectionToken<any>('app.config');

export interface AppConfig {
  apiEndpoint: string;
  streetView: any;
  taxRate: any;
  googlePlaces: any;
}


export function RESTANGULAR_CONFIG (
    RestangularProvider,
    router: Router,
    sessionService: SessionService,
    spinnerService: SpinnerService,
    toasterService: ToasterService,
    jwtService: JwtService
) {
  RestangularProvider.setBaseUrl(APP_DI_CONFIG.apiEndpoint);
  // RestangularProvider.setDefaultHeaders({'X_AUTH_TOKEN': sessionService.get('uptracker_token')});

  RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, params) => {
    if ( sessionService.get('uptracker_token') && jwtService.tokenExpired(sessionService.get('uptracker_token')) ) {
      sessionService.remove('uptracker_selfId');
      sessionService.remove('uptracker_token');
      sessionService.remove('uptracker_onboardacc');
      router.navigate['/login'];
      toasterService.pop('error', 'Your session has expired.');
      return;
    }

    if(!(path == "vendors" || path == "products")){
      spinnerService.show();
    }

    // let urlArr = url.split('/');
    let newHeaders = headers;
    // if (urlArr[urlArr.length - 1] != 'streetview')
      newHeaders = {
        'X_AUTH_TOKEN': sessionService.get('uptracker_token')
      };
    
    return {
      headers: newHeaders
    };
  });

  RestangularProvider.addResponseInterceptor((data, operation, what, url, response)=> { 
    spinnerService.hide();
    return data;
  });

  RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
    let actionAuth: boolean = false,
        errMsg;
    let err = response;
    try {
      let body = err.json();
      errMsg = body.length ? body[0]['error_message'] || body[0]['error'] : body['error_message'] || body['error'];

      let endpoint = _.last(response.request.url.split('/'));
      switch (endpoint){
        case 'login': actionAuth = true; break;
        case sessionService.get('uptracker_selfId'): actionAuth = true; break;
        default: actionAuth = false;
      }
    } catch(err) {
      errMsg = 'Something went wrong'
    }


    // logout user if local storage or cookies have wrong token or user doesn't exist
    if ((err.status == 401 || err.status == 404) || (new RegExp("User doesn't exist.", 'i').test(errMsg) && actionAuth)) {
      sessionService.remove('uptracker_token');
      sessionService.remove('uptracker_selfId');
      sessionService.remove('uptracker_onboardacc');
      router.navigate(['/login']);
    }

    // handle error 500
    if (!err.status || err.status == 500){
      errMsg = 'Something went wrong';
    }

    spinnerService.hide();
    toasterService.pop('error', errMsg);
  });
}
