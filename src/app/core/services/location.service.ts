import { ModelService } from "../../overrides/model.service";
import { Injectable, Injector } from "@angular/core";
import { Subscribers } from "../../decorators/subscribers.decorator";
import { Restangular } from "ngx-restangular";
import { AppConfig, APP_CONFIG } from "../../app.config";
import { Observable, BehaviorSubject } from "rxjs";
import * as _ from 'lodash';
import { Http } from "@angular/http";
import { UserService } from "./user.service";
import { AccountService } from "./account.service";
import { isUndefined } from "util";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class LocationService extends ModelService {
  public appConfig: AppConfig;
  public selfData$: Observable<any>;
  public selfData: any;
  public updateSelfData$ = new BehaviorSubject(null);

  public subscribers: any = {};

  locationTypeCollection$ = Observable.empty();
  col$ = new Observable();
  locationAccountId: string = null;

  constructor(

    public injector: Injector,
    public restangular: Restangular,
    public http: Http,
    public userService: UserService,
    public accountService: AccountService
  ) {
    super(restangular);

    this.appConfig = injector.get(APP_CONFIG);

    this.onInit();

  }

  onInit() {

    // Get Locations first time when service inits
    this.loadCollection$ = this.restangular.one('accounts', this.userService.selfData.account_id).all('locations').customGET('')
      .map((res: any) => {
        // set local variable with id account of this locations, need for making request when user logout-login
        this.locationAccountId = res.data.account_id;
        return res.data.locations;
      })
      .do((res: any) => {
        this.updateCollection(res);
      })
    .subscribe();

  }

  addSubscribers() {
    this.subscribers.collection = this.collection$.subscribe(res => {
      this.accountService.updateSelfDataField("locations", res);
    })
  }

  getLocations(){

    return this.collection$.switchMap((res: any) => {
      // checking if in collection$ - locations of user that logined, if not make request and set new id account
      if (this.locationAccountId == this.userService.selfData.account_id){
        return this.collection$;
      } else {
        return this.restangular.one('accounts', this.userService.selfData.account_id).all('locations').customGET('')
          .map((res: any) => {
            this.updateCollection(res.data.locations);
            this.locationAccountId = res.data.account_id;
            return res.data.locations;
          });
      }
    });
  }


  addLocation(data: any){
    return this.restangular.one('accounts', data.account_id).all('locations').post(data)
      .do((res: any) => {
        this.updateCollection(res.data.account.locations);
      });
  }

  deleteLocation(data: any){
    return this.restangular.one('accounts', this.userService.selfData.account_id).one('locations', data.id).remove()
      .do((res: any) => {
        let account = this.accountService.selfData;

        account.users = _.map(account.users, (user: any) => {
          _.remove(user.locations, (location: any) => location.location_id == data.id);
          return user;
        });

        _.remove(account.locations, (location: any) => {
          return location.id == data.id;
        });
        this.accountService.updateSelfDataField('users',account.users);
        this.updateCollection(account.locations);
      });
  }

  updateInventoryLocations(data) {
    let location = Object.assign({},{inventory_locations: data.inventory_locations},{id: data.id});
    return this.restangular.one('accounts', data.account_id).all('locations').post(location)
      .do((res: any) => {
        this.updateCollection(res.data.account.locations);
      });
  }

  getLocationTypes(){
    return this.locationTypeCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.locationTypeCollection$ = this.restangular.all('config').all('location_types').customGET('')
          .map((res: any) => {
            return res.data;
          });
      }
      return this.locationTypeCollection$;
    });
  }

  getLocationStreetView(params) {
    return this.http.get(this.getLocationStreetViewUrl(params, true))
  }

  getLocationStreetViewUrl(params, type?) {
    let url = this.appConfig.streetView.endpoint;
    if(type) {
      url += "/metadata";
    }
    params.key = this.appConfig.streetView.apiKey;
    params.size = '520x293';

    let imageUrl = url + '?size=' + params.size + '&key=' + params.key + '&location=' + params.location;
    return imageUrl.replace(/\s/g,'%20').replace(/#/g, '');
  }

  updateCollection(data) {
    this.updateCollection$.next(data);
  }

  updateCollectionField(field, data){
    let locations = this.collection;
    locations[field] = data;
    this.updateCollection(locations);
  }

  updateSelfData(data) {

    this.updateSelfData$.next(data)
  }
}
