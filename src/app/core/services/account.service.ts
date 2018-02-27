import { Injectable, Injector, Inject } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { isUndefined } from 'util';
import * as _ from 'lodash';
import { Restangular } from 'ngx-restangular';

import { ModelService } from '../../overrides/model.service';
import { UserService } from './user.service';
import { Subscribers } from '../../decorators/subscribers.decorator';
import { AppConfig, APP_CONFIG } from '../../app.config';
import { Http } from "@angular/http";
import { ToasterService } from "./toaster.service";

@Injectable()
@Subscribers({
  initFunc: 'onInit',
  destroyFunc: null,
})
export class AccountService extends ModelService{  
  selfData: any;
  selfData$: Observable<any>;
  updateSelfData$: Subject<any> = new Subject<any>();
  
  locationTypeCollection$ = Observable.empty();
  stateCollection$ = Observable.empty();
  currencyCollection$ = Observable.empty();
  departmentCollection$ = Observable.empty();
  productCategoriesCollection$ = Observable.empty();
  productAccountingCollection$ = Observable.empty();
  roleCollection$ = Observable.empty();

  onboardacc: any = {
    total: [],
    budget_distribution: [],
    currency: 'USD',
    fiscal_year: null,
    annual_income: 0,
    annual_inventory_budget: 0,
    disabledRange: [],
    taxRate: null
  };
  locations$: Observable<any>;
  dashboardLocation$: BehaviorSubject<any> = new BehaviorSubject<any>(null); //TODO change null to {}

  public appConfig: AppConfig;
  public googleStreetEmptyImage: string = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAElAggDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2OiiipGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRXJWWo6iPEyx3epM9vPdTwQxxJDJAwUMQgK4kSRQvzbsrlSOMigDraK4+28by3WmS3Uelp5pNk0EX2rh47qXy0LNt+RhySuDjjnmn/8JpIryLLpgVpLie2sQLjP2iSO48gg/L8mThv4vl3H+E0AdbRVDWdTXR9Me+dA8cckavl9oVWdVZs/7IJb3x261yo+Iy/Zp5G0mVZIo/MMW8s2HeJYThVJw4mBOASu1hhjQB3NFc3fa7dS/DvUtbhgmsLuOwuJo0ljIaN0VsHa6gkZUEblGQRkdqjm8Wy22mX01xYxQ3tpeC0+ztOzCRjGso2skbMTsYHAXjB7DNAHUUVzFl4xS+k0+KOyZZdQjt57dGk+9DKhdnPHBTY4I7nbyNwxN4U8UHxRBPONOuLSJNjRPIjhZFbOMFkXLDHIXcBkYY5oA6GiuTj8aOr37XemGK3t4b6aKSOfe0q2svlyZXaNpJKkcnqfTnX0LV5NWguvPtkt7i1n8iVI5vNTOxXBV8DIw47DnI7UAatFcTb+NLz7Bpzx6YboS2GnzySy3Sq++6do0GBGATvUZICjBJAGADLqPjtdM8Ox6pNZIJg9wk1r5zFl8h2SUoVQ7gGXqQo+YZIzQB2NFc6/id18VR6Otkhha6+yNOZ8MH+ztPkR7eVwFGc9SfTnOsPHcuo6LPqEGizrie1itxMZIkmE8qxqd7RjkbskKGHIwxzQB2dFYejeIf7YvZLVbTypLaM/a/3mfJl3sgQcfNnYzZ442nHzVkWHi+6t01H+07VnjgGpXMM8bgmSO2uGQoUAGCFZADk5wc47gHZ0Vy1h4tub620xzpEkMt5qBsysxkjAURPKZF3xqzDCEY2jnPPGTY8KeKD4ognnGnXFpEmxonkRwsitnGCyLlhjkLuAyMMc0AdDRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFVI9K06LUH1COwtUvZBte5WFRIw9C2MmrdFAFOLSdNgSRItPtY0klE7qkKgNICGDnjlgQDnrkCo5dFs5byyuNmwWcss8cSKoQyyAhnIxnd8z9+rknJwRoUUAVBpdj9hmsWtIntZnkeSGRd6uXYu+Qc5yzE/jRJpenzPM0tjau00QhlLQqTJGOitxyvJ4PHNW6KAKsem2EOnHTorK2SxKGM2yxKI9pzlduMYOTkY70k+l6ddK63FhazLJKJnEkKsGkAChzkcsAAAeuAPSrdFAFaLT7KFrdorO3ja3i8mApEoMUfHyLxwvyjgccD0pLTTLDT5J5LKxtrZ523zNDEqGRvViByeT19atUUAV1sLONgyWkCsBIARGAcSNuk7fxMAT6kZNLZ2Vpp9sttZWsNtApJEUMYRRnk8Dip6KAKi6Xp6IqJY2yoixIqiFQAsR3RgcdEPKjseRio7jRNJvIliudLsp41Z3VZbdGAZyS5AI6sSc+uTmr9FAGI3hewfxQmvs8zXScqpKlQdhTION33S3y7tuSTjJJq7Do2lW5mMGm2cRmkWaXZAq+Y6tuVmwOWB5BPIPNXqKAKVhpkGnSXksbO8t5cG4md8ZLEBQOAOAqqB7DnJyTKthZxsGS0gVgJACIwDiRt0nb+JgCfUjJqxRQBStdH0yxjjjs9OtLeOOQzIsMCoFcqVLAAcMVJGeuCRSQ6NpVuZjBptnEZpFml2QKvmOrblZsDlgeQTyDzV6igAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooqvPf2Vq4S4u7eFz0WSQKT+ZoAsUUisrqGUhlIyCDkGloAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAMjxJf3FjparZ4F3dTJbQE9FZzjP864q/ng0vUm07TtBg1WUSvDLc3kbTS3EqAGTaAflxmu38QabNqWl7LVgt3DIs9ux6b1OR/hXE6kNOvNUN++s3Hh+/wB7ST20kEhKSMAHaNl6hsU0IsaFqWoabqFxbw6HqEX2o5tNNYFUXGNzb35A/DHNbsnim6sNiapo80Uk3FsbaVZ1mbONoK9D7VlPqpaICZdR/sU2MliupzIXk3uQxlI67SQB9PyqvpV9baRa2kGneZrC298L25kt4GVIVCbMKG6tzn8KAN+XxHqGnqZ9X0R7azDBXlhuFmMRPQOo5FMk1bXr61f7N4cYwzxEx77xEk2EH5ih5ArlDd6Ro9hq8lpqZ1OW9i8pYhA67QX3b5S38Q6cVv2H2C+8cjV/t80NzLE0jWEtu6yR/ucEMx42Y5B9xQBkaTANIvdBuNM017m7vLB2eNZCN7biNxJ4UAD6V11hrs8l/FY6nY/Y551LW7pMsscwHUBhxkelcnpXiTS4P7NhmPmxDSpLS5bynYQkvnLAYJXpnB71LarLqmv6UtnqCX8FpKZJEt7YwW1uvbb0yx+n9aAPQ6KKKQwooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKiubiKztZrmd9kMKNJI2CcKBknA56Cpay/En/Iq6v/15Tf8AoDUAZn/Cw/Cv/QU/8l5f/iaP+Fh+Ff8AoKf+S8v/AMTXnMFvbQabbrDa2s0kkaMscgTdMWRScEqXb5iyYQrt28nvVbyrQakbCa3txaNdpDbMqAOyiUAuW6kFQR1xk8dOGI9P/wCFh+Ff+gp/5Ly//E0f8LD8K/8AQU/8l5f/AImvL7IwXF7pEt5p9uZJrxoDGsYjXaGjwSoABxuYfhznFQaNbwNYRcRG4ubloAJYBIp+VcAnIKDLH5hzx7UAer/8LD8K/wDQU/8AJeX/AOJo/wCFh+Ff+gp/5Ly//E145poEWnX15HBHNcQtGqiRA4RG3bn2ng4IUc8Dd9K0LvS7dZXublA6ssJ8qwyvL7huw65X7uduP4hjANAHqf8AwsPwr/0FP/JeX/4mj/hYfhX/AKCn/kvL/wDE15NLodvAJYWeZ5wk8izLjywImYYIxnJ2evG5etW49Fs4BesI52a282DdKAUkPkTNuXj1VSOTjg9+AD07/hYfhX/oKf8AkvL/APE0V5FrOk2enwnyLlpZopRFKNrFScE5yUAHTpls5zmigD6EpGRWxuUHHTIoopDFpFVVGFAA9AKKKAILqyt720mtp4laKZdrjpn/AOvWGfDmpNb/AGF/EVy2nlfLMXkp5hT+6ZOuKKKAN+3t4rW2jt4UCRRqEVR2AqRVVRhQAPQCiigBaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArL8Sf8irq/wD15Tf+gNRRQB8/Q6jfW9u1vDeXEcLZ3RpKyqc9cgHFK2p372wtmvrk24AAiMrbQB04zjjAoopiGy395PPHPLdzyTR42SPISy45GDnIpkN1cW6SJDPLGsg2uEcgMPQ460UUAEFxPayiW3mkhkHAeNipH4inpfXkdw9wl1Os0md8iyEM2euTnJoooAaLq4W3e3W4lEDnLRhztY+pHSrlxrVzPapbIBDGox+7dySNpXGWY4GGYYGByaKKAKct1cTxxxzXEsiRjCK7khR7A9KKKKAP/9k='
  public dashboardLocation: any;
  
  constructor(
    public injector: Injector,
    public userService: UserService,
    public toasterService: ToasterService,
    public restangular: Restangular,
    public http: Http
  ) {
    super(restangular);
    this.appConfig = injector.get(APP_CONFIG);
  
    this.onInit();
  }
  
  onInit(){
    this.selfData$ = Observable.merge(
        this.updateSelfData$
    );
    this.selfData$.subscribe((res) => {
      this.selfData = res;
      console.log(`${this.constructor.name} Update SELF DATA`, res);

      //update user after update account
      
      this.userService.updateSelfDataField('account', this.selfData);
    });

    this.locations$ = this.userService.selfData$
        .filter(() => {
          return !this.userService.isGuest();
        })
        .map((res: any) => {
          return res.account.locations;
        });
  
    this.dashboardLocation$.subscribe((l:any)=>{
      this.dashboardLocation = l;
    });
  }
  
  addSubscribers(){
    this.entity$.subscribe((res) => {
      this.updateSelfData(res);
    });
  }

  updateSelfData(data){
    this.updateSelfData$.next(data);
  }

  updateSelfDataField(field, data){
    let account = this.userService.selfData.account;
    account[field] = data;
    this.updateSelfData(account);
  }

  createCompany(data){
    return this.restangular.all('register').all('company').post(data)
        .do(
          (res: any) => {
            this.addToCollection$.next(res.data.account);
            this.updateEntity$.next(res.data.account);
            this.updateSelfData(res.data.account);
          }
        );
  }

  getStates(){
    return this.stateCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.stateCollection$ = this.restangular.all('config').all('states').customGET('')
          .map((res: any) => {
            return res.data;
          });
      }
      return this.stateCollection$;
    });
  }

  getDepartments(){
    return this.departmentCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.departmentCollection$ = this.restangular.all('config').all('departments').customGET('')
            .map((res: any) => {
              return res.data;
            });
      }
      return this.departmentCollection$;
    });
  }

  getProductCategories(){
    return this.productCategoriesCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.productCategoriesCollection$ = this.restangular.all('config').all('product_categories').customGET('')
            .map((res: any) => {
              return res.data;
            });
      }
      return this.productCategoriesCollection$;
    });
  }
  
  getProductAccounting(){
    return this.productAccountingCollection$.isEmpty().switchMap((isEmpty) => {
      if(isEmpty) {
        this.productAccountingCollection$ = this.restangular.all('config').all('accounting_categories').customGET('')
            .map((res: any) => {
              return res.data;
            });
      }
      return this.productAccountingCollection$;
    });
  }
  
  getUsers() {
    let usersLoaded = (this.userService.selfData.account.users && !_.isEmpty(this.userService.selfData.account.users)) ? this.userService.selfData.account.users[0].name : false;
    if (!usersLoaded) {
      return this.restangular.one('accounts', this.userService.selfData.account_id).all('users').customGET('')
      .map((res: any) => {
        return res.data.users;
      })
      .do((res: any) => {
        let account = this.userService.selfData.account;
        account.users = res;
        this.updateSelfData(account);
      });
    } else {
      return this.userService.selfData$.map(res => res.account.users);
    }
  }
  
  addUser(data) {
    return this.restangular.all('users').post(data)
    .do((res: any) => {
      let account = this.userService.selfData.account;
      // if new user push him to account users array, else update user in array
      if (_.some(account.users, {'id': res.data.user.id})) {
        let userArr = _.map(account.users, function (user) {
          if (user['id'] == res.data.user.id) {
            return _.cloneDeep(res.data.user);
          } else {
            return user;
          }
        });
        account.users = userArr;
      } else {
        account.users.push(res.data.user);
      }
      
      // check if changed user self data
      if (res.data.user.id == this.userService.getSelfId()) {
        let user = res.data.user;
        user.account = account;
        this.userService.updateSelfData(user);
      } else {
        this.updateSelfData(account);
      }
    });
  }

  deleteUser(data: any){
    return this.restangular.one('users', data.id).remove()
      .do((res: any) => {
        let account = this.userService.selfData.account;
        _.remove(account.users, (user: any) => {
          return user.id == data.id;
        });
        this.updateSelfData(account);
      });
  }

  changeUserPassword(id, passObj) {
    return this.restangular.one('users',id).post("password",passObj)
      .do(res => {
        this.toasterService.pop("",res.message);
      })
  }

  putAccounting(data: any){
    return this.restangular.one('accounts', data.account_id).customPUT(data)
      .do((res: any) => {
        this.updateSelfData(res.data.account.account);
      });
  }

  getCurrencies(){
    return this.currencyCollection$.isEmpty().switchMap((isEmpty) => { 
      if (isEmpty) {
        this.currencyCollection$ = this.restangular.all('config').all('currency').customGET('')
            .map((res: any) => {
              let currencyArr = _.sortBy(res.data, 'priority');
              return currencyArr;
            });
      }
      return this.currencyCollection$;
    });
  }

  getRoles(){
    let rolesLoaded = this.userService.selfData.account.roles ? this.userService.selfData.account.roles[0].role : false;
    if (!rolesLoaded) {
      return this.restangular.one('accounts', this.userService.selfData.account_id).all('permissions').customGET('')
          .map((res: any) => {
            return res.data.roles;
          })
          .do((res: any) => {
            let account = this.userService.selfData.account;
            account.roles = res;
            this.updateSelfData(account);
          });
    } else {
      return this.userService.selfData$.map(res => res.account.roles);
    }
  }
  
  addRole(data){
    return this.restangular.one('accounts', data.account_id).all('roles').post(data)
        .do((res: any) => {
          let account = this.userService.selfData.account;
          account.roles = res.data.roles;
          this.updateSelfData(account);
        });
  }

  getTaxRate(address) {
    let url = this.appConfig.taxRate.endpoint + "?postal=" + address.postal_code + "&country=usa" + "&state=" + address.state + "&city=" + address.city + "&street=" + encodeURIComponent(address.street_1) + "&apikey=" + encodeURIComponent(this.appConfig.taxRate.apiKey);
    return this.http.get(url)
  }
}