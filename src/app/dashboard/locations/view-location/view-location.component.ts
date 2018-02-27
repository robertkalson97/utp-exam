import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location }                 from '@angular/common';

import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { AccountService, ModalWindowService } from '../../../core/services/index';
import { LocationModel } from '../../../models/index';
import { LocationService } from "../../../core/services/location.service";
import * as _ from 'lodash';

import { ReplaySubject } from 'rxjs/ReplaySubject';


@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.scss']
})

@DestroySubscribers()
export class ViewLocationComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public location: LocationModel;
  public locationId: string;
  public deleteLocation$: ReplaySubject<any> = new ReplaySubject(1);
  
  constructor(
    public accountService: AccountService,
    public windowLocation: Location,
    public route: ActivatedRoute,
    public router: Router,
    public locationService: LocationService,
    public modalWindowService: ModalWindowService
  ) {
    this.location = new LocationModel();
  }
  
  ngOnInit() {
    this.route.params
    .switchMap((params: Params) =>
      this.locationService.collection$.map((m: any) => {
          return m.filter(l => l.id == params['id']);
        }
      )
    )
    .filter(l => !_.isEmpty(l))
    .map(l=>l[0])
    .subscribe(location => {
      this.location = new LocationModel(location);
      this.location.street_1 = this.location.address.street_1;
      this.location.street_2 = this.location.address.street_2;
      this.location.city = this.location.address.city;
      this.location.zip_code = this.location.address.postal_code;
      this.location.state = this.location.address.state;
    });
    
    this.subscribers.deleteLocationSubscription = this.deleteLocation$
    .switchMap(() => this.locationService.deleteLocation(this.location))
    .subscribe(() => this.goBack());
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
  }
  
  deleteLocation(location) {
    this.modalWindowService.confirmModal('Delete location?', {text: 'Are you sure you want to delete the location?', btn: 'Delete'}, this.deleteLocationFunc.bind(this));
  }
  
  deleteLocationFunc() {
    this.deleteLocation$.next('');
  }
  
  goBack(): void {
    this.router.navigate(['/locations']);
  }
  
}
