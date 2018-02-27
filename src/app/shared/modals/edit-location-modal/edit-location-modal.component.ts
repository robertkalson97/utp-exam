import { Component, OnInit, NgZone } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
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

export class EditLocationModalContext extends BSModalContext {
  public location: any;
}

@Component({
  selector: 'app-edit-location-modal',
  templateUrl: './edit-location-modal.component.html',
  styleUrls: ['./edit-location-modal.component.scss']
})
@DestroySubscribers()
export class EditLocationModal implements OnInit, CloseGuard, ModalComponent<EditLocationModalContext> {
  public searchKey: any;
  public subscribers: any = {};
  context: EditLocationModalContext;
  public location: LocationModel;
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

  public inventory_location: any = { name: '', floor_stock: true};

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
  public sortBy;

  uploadedImage;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };
  locationTypes: string[];

  constructor(public zone: NgZone,
              public dialog: DialogRef<EditLocationModalContext>,
              public toasterService: ToasterService,
              public userService: UserService,
              public accountService: AccountService,
              public phoneMaskService: PhoneMaskService,
              public fileUploadService: FileUploadService,
              public modalWindowService: ModalWindowService,
              public locationService: LocationService) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    this.location = new LocationModel();
  }

  ngOnInit() {
    let locationData = this.context.location || {};

    // set default storage locations if no one get from context
    locationData.inventory_locations = locationData.inventory_locations ? locationData.inventory_locations : this.defaultStorageLocations;

    this.location = new LocationModel(locationData);

    if (this.context.location) {
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
    }
    else {
      this.storageLocations$.next(this.location.inventory_locations);
    }

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

    this.floorStockStorageLocations$ = this.filteredStorageLocations$.map(location => _.filter(location, {floor_stock: true}));
    this.backStockStorageLocations$ = this.filteredStorageLocations$.map(location => _.filter(location, {floor_stock: false}));

    // this.states$ = this.accountService.getStates().take(1);
     this.locationService.getLocationTypes().subscribe((types:string[])=>{this.locationTypes = types;});

  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
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
  
  onCountryChangeExt($event) {
    this.selectedCountryExt = $event;
  }

  onFaxCountryChangeExt($event) {
    this.selectedFaxCountryExt = $event;
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
    if (!this.location.image) {
      // TODO: move logic to location service;

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
    this.locationService.addLocation(data).subscribe(
      (res: any) => {
        this.dismissModal();
      }
    );
  }

  deleteLocation(data) {
    this.modalWindowService.confirmModal('Delete Location?', {text: 'Are you sure you want to delete the location?', btn: 'Delete'}, this.deleteLocationFunc.bind(this));
  }

  deleteLocationFunc() {
    this.subscribers.deleteUserSubscription = this.locationService.deleteLocation(this.location).subscribe((res: any) => {
      this.dismissModal();
    });
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

  addStorageLocation(data:any) {
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
      this.subscribers.updateInvertorySubscriber = this.locationService.updateInventoryLocations(this.location).subscribe(res => {
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
}
