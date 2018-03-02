import { Component, OnInit, NgZone, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Location }                 from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { DestroySubscribers } from 'ngx-destroy-subscribers';

import * as _ from 'lodash';

import {
  AccountService,
  ToasterService,
  UserService,
  PhoneMaskService,
  FileUploadService,
  ModalWindowService
} from '../../../core/services/index';
import { LocationModel } from '../../../models/index';
import { LocationService } from "../../../core/services/location.service";
import { InventoryLocationModel } from "../../../models/inventory-location.model";


@Component({
  selector: 'app-edit-location',
  templateUrl: './edit-location.component.html',
  styleUrls: ['./edit-location.component.scss']
})

@DestroySubscribers()
export class EditLocationComponent implements OnInit, OnDestroy {
  public searchKey: any;
  
  public subscribers: any = {};
  public location: LocationModel;
  public states$: Observable<any> = new Observable<any>();
  public locationTypes$: Observable<any> = new Observable<any>();
  public typeDirty: boolean = false;
  public stateDirty: boolean = false;
  public locationFormPhone: string = null;
  public locationFormPhoneExt: string = null;
  public locationFormFax: string = null;
  public locationFormFaxExt: string = null;
  public phoneMask: any = this.phoneMaskService.defaultTextMask;
  // default country for phone input
  public selectedCountry: any = this.phoneMaskService.defaultCountry;
  public selectedCountryExt: any = this.phoneMaskService.defaultCountry;
  public selectedFaxCountry: any = this.phoneMaskService.defaultCountry;
  public selectedFaxCountryExt: any = this.phoneMaskService.defaultCountry;
  public primaryTaxRate: string;
  public secondaryTaxRate: string;
  
  public inventory_location: any = { name: '', floor_stock: true};
  public locationToDelete = null;

  // setting default storage locations when creating new one location
  public defaultStorageLocations = [
    new InventoryLocationModel({name: "Working Stock", floor_stock: true, default_location: true, _id: 1}),
    new InventoryLocationModel({name: "Back Stock", floor_stock: false, default_location: true, _id: 2})
  ];
  public filterSearch$: any = new BehaviorSubject(null);
  public filterStorageOption$: any = new BehaviorSubject({});
  public storageLocations$ = new BehaviorSubject([]);
  public filteredStorageLocations$;
  public floorStockStorageLocations$;
  public backStockStorageLocations$;

  public isStorageLocationFormShow = true;
  public storageLocation: string;
  public forStockLocation: boolean;
  public sortBy;
  subs:any;
  public locationTypesArr: string[] = [];

  uploadedImage;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };
  public locationId: string;
  public classValid: string = '';
  
  public deleteLocation$: ReplaySubject<any> = new ReplaySubject(1);
  public addToLocation$: ReplaySubject<any> = new ReplaySubject(1);

  constructor(public zone: NgZone,
              public toasterService: ToasterService,
              public userService: UserService,
              public accountService: AccountService,
              public phoneMaskService: PhoneMaskService,
              public fileUploadService: FileUploadService,
              public route: ActivatedRoute,
              public windowLocation: Location,
              public modalWindowService: ModalWindowService,
              public router: Router,
              public locationService: LocationService) {
    this.location = new LocationModel();
  }

  ngOnInit() {
  
    Observable.combineLatest(
      this.route.params,
      this.locationService.collection$,
    )
    .map(([params, selfData]) => {
      
      this.locationId = params['id'];
      return selfData;
    })
    .filter(loc=>!_.isEmpty(loc))
    .subscribe(location => {
      this.updateLocs(location);
    });
    
    
    this.filteredStorageLocations$ = Observable.combineLatest(
      this.storageLocations$,
      this.filterSearch$,
    )
      .map(([locations, searchkey]: any) => {

      if (searchkey && searchkey!='') {
        locations = _.reject(locations, (location: any) =>{
          let key = new RegExp(searchkey, 'i');
          return !key.test(location.name);
        });
      }

      locations = _.sortBy(locations, 'name');
      return locations;
    });

    this.floorStockStorageLocations$ = this.filteredStorageLocations$
    .map(location => _.filter(location, {floor_stock: true}));
    
    this.backStockStorageLocations$ = this.filteredStorageLocations$
    .map(location => _.filter(location, {floor_stock: false}));
    
    this.locationTypes$ = this.locationService.getLocationTypes().take(1);
    
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
  }
  
  addSubscribers() {
    this.subscribers.locationTypesSubscription = this.locationTypes$
    .subscribe(types => this.locationTypesArr = types);
  
    this.subscribers.deleteLocationSubscription = this.deleteLocation$
    .switchMap(() => this.locationService.deleteLocation(this.location))
    .subscribe(() => this.goBack());
    
    this.subscribers.addToLocationSubscription = this.addToLocation$
    .switchMap((data) => this.locationService.addLocation(data))
    .subscribe(() => this.goBack());
  }
  
  updateLocs(location){
    let locationArr = _.filter(location, (lc: any) => (lc.id == this.locationId));
    let locationData:any = !_.isEmpty(locationArr) ? locationArr[0] : {} ;
    locationData.inventory_locations = locationData.inventory_locations ? locationData.inventory_locations : this.defaultStorageLocations;
  
    this.location = new LocationModel(locationData);
    this.location.street_1 = this.location.address.street_1;
    this.location.street_2 = this.location.address.street_2;
    this.location.city = this.location.address.city;
    this.location.zip_code = this.location.address.postal_code;
    this.location.state = this.location.address.state;
    this.uploadedImage = this.location.image;
    this.location.formattedAddress = this.location.address.formattedAddress;
  
    this.location.inventory_locations = _.map(this.location.inventory_locations, (location: any,index) => {
      location._id = index + 1;
      return location;
    });
  
    this.storageLocations$.next(this.location.inventory_locations);
  
    this.locationFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.location.phone);
    this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.location.phone);
  
    this.locationFormFax = this.phoneMaskService.getPhoneByIntlPhone(this.location.fax);
    this.selectedFaxCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.location.fax);
  
    this.locationFormPhoneExt = this.location.phone_ext;
    this.locationFormFaxExt = this.location.fax_ext;

    this.primaryTaxRate = this.location.primary_tax_rate*100 + '%';
    this.secondaryTaxRate = this.location.secondary_tax_rate*100 + '%';

  }

  changeState() {
    this.stateDirty = true;
  }

  changeType() {
    this.typeDirty = true;
  }

  onCountryChange($event) {
    this.selectedCountry = $event;
  }

  onFaxCountryChange($event) {
    this.selectedFaxCountry = $event;
  }

  // upload by input type=file
  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.onFileDrop(myReader.result);
    };
    myReader.readAsDataURL(file);
  }

  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(imgBase64: string): void {
    var img = new Image();
    img.onload = () => {
      let resizedImg: any = this.fileUploadService.resizeImage(img, {resizeMaxHeight: 250, resizeMaxWidth: 250});
      let orientation = this.fileUploadService.getOrientation(imgBase64);
      let orientedImg = this.fileUploadService.getOrientedImageByOrientation(resizedImg, orientation);

      this.zone.run(() => {
        this.uploadedImage = orientedImg;
      });
    };
    img.src = imgBase64;
  }

  onSubmit() {
    this.location.account_id = this.userService.selfData.account_id;

    this.location.phone = this.selectedCountry[2] + ' ' + this.locationFormPhone;
    this.location.phone_ext =  this.locationFormPhoneExt;
    this.location.fax = this.locationFormFax ? this.selectedFaxCountry[2] + ' ' + this.locationFormFax : null;
    this.location.fax_ext =this.locationFormFaxExt ;
    let address = {location: this.location.formattedAddress};
    this.location.image = this.uploadedImage;
    this.location.primary_tax_rate = parseFloat(this.primaryTaxRate)/100 || null;
    this.location.secondary_tax_rate = parseFloat(this.secondaryTaxRate)/100 || null;

    if (!this.location.image) {
      this.locationService.getLocationStreetView(address)
        .map((res: any) => JSON.parse(res._body))
        .subscribe(res => {
          if (res.status == "OK") {
            this.location.image = this.locationService.getLocationStreetViewUrl(address);
          }
          else {
            this.location.image = null;
          }
          this.addLocation(this.location);
        });

    } else {
      this.addLocation(this.location);
    }
    
  }

  addLocation(data) {
    this.addToLocation$.next(data);
  }

  deleteLocation(data) {
    this.modalWindowService.confirmModal('Delete Location?', {text: 'Are you sure you want to delete the location?', btn: 'Delete'}, this.deleteLocationFunc.bind(this));
  }

  deleteLocationFunc() {
    this.deleteLocation$.next('');
  }

  changeSearchName(event) {
    this.filterSearch$.next(event.target.value.trim())
  }

  sortStorageLocations() {
    let sort = null;
    switch (this.sortBy) {
      case "floor_stock":
        sort = ['floor_stock', true];
        break;
      case "back_stock":
        sort = ['floor_stock', false];
        break;
      case "":
        sort = null;
        break;
    }
    this.filterStorageOption$.next(sort);
  }

  showAddStorageLocationForm() {
    this.isStorageLocationFormShow = !this.isStorageLocationFormShow;
    this.inventory_location = { name: '', floor_stock: true};
  }

  toggleFloorStock() {
    this.inventory_location.floor_stock = !this.inventory_location.floor_stock;
  }

  addStorageLocation(data) {
    this.location.account_id = this.userService.selfData.account_id;

    let storageLocation:any = _.cloneDeep(data);

    // if new storage location push storage location to inventory locations
    if (!storageLocation._id) {
      storageLocation._id = this.location.inventory_locations.length + 1;
      storageLocation.id = null;

      this.location.inventory_locations.push(storageLocation);
    }
    // if _id exists edit storage location with current _id
    else {
      this.location.inventory_locations[storageLocation._id - 1] = storageLocation;
    }

    this.storageLocations$.next(this.location.inventory_locations);

    if (this.location.id) {
      this.locationService.updateInventoryLocations(this.location).subscribe(
        res => {},
        err => {
          _.remove(this.location.inventory_locations, {_id: storageLocation._id});
          this.storageLocations$.next(this.location.inventory_locations);
        });
    }

    this.inventory_location = { name: '', floor_stock: true};
    this.isStorageLocationFormShow = true;
  }

  editStorageLocation(data){
    this.isStorageLocationFormShow = false;
    this.inventory_location = _.cloneDeep(data);
  }

  deleteStorageLocation(storageLocation) {
    if (!storageLocation.default_location) {
      this.modalWindowService.confirmModal('Delete Storage Location?', {text: 'Are you sure you want to delete the storage location?', btn: 'Delete'}, this.deleteStorageLocationFunc.bind(this,storageLocation._id))
    }
  }

  deleteStorageLocationFunc(id) {
    this.location.account_id = this.userService.selfData.account_id;

    let removedStorageLocation: any = _.remove(this.location.inventory_locations, {_id: id});
    this.storageLocations$.next(this.location.inventory_locations);

    if(this.location.id) {
      this.subscribers.updateInvertorySubscriber = this.locationService.updateInventoryLocations(this.location)
      .subscribe(res => {
      }, err => {
        if(removedStorageLocation.length) {
          this.location.inventory_locations.splice(removedStorageLocation[0]._id - 1,0,removedStorageLocation[0]);
          this.storageLocations$.next(this.location.inventory_locations);
        }
      });
    }
  }

  addGoogleAddress(event) {

    let postalFlag = false;
    if (event.address_components) {
      event.address_components.forEach((item) => {
        switch (item.types[0]) {
          case 'country':
            this.location.country = item.long_name;
            break;
          case 'administrative_area_level_1':
            this.location.state = item.short_name;
            break;
          case 'locality':
            this.location.city = item.long_name;
            break;
          case 'route':
            this.location.street_1 = item.long_name;
            break;
          case 'street_number':
            this.location.street_2 = item.long_name;
            break;
          case 'postal_code':
            postalFlag = true;
            this.zone.run(() => {
              this.location.zip_code = item.long_name;
              this.classValid = 'valid';
            });
            break;
        }
      });
      //if in address no postal code change postal code to null
      if (!postalFlag) {
        this.zone.run(() => {
          this.location.zip_code = null;
        });
      }
    }

    this.location.formattedAddress = event.inputValue;
    
  }
  
  addAddress(event) {
    this.location.address = event.target.value;
  }
  
  goBack(): void {
    this.router.navigate(['/locations'])
  }
  
}
