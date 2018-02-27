import { Component, OnInit, NgZone, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Location }                 from '@angular/common';

import { Modal } from 'angular2-modal';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import * as _ from 'lodash';

import {
  UserService,
  AccountService,
  PhoneMaskService,
  ToasterService,
  FileUploadService,
  ModalWindowService
} from '../../../core/services/index';
import { ChangePasswordUserModal } from '../../../shared/modals/change-password-user-modal/change-password-user-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../../models/user.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
@DestroySubscribers()
export class EditUserComponent implements OnInit, OnDestroy {
  public searchKey: any;
  public roleArr: any;
  
  public subscribers: any = {};
  public user: any = {};
  public locationArr: any;
  public locations$: Observable<any>;
  public locationCheckboxes$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public departmentCollection$: Observable<any> = new Observable<any>();
  public departmentCollection: any[];
  public locationDirty: boolean = false;
  public departmentDirty: boolean = false;
  public profileFormPhone: string = null;
  public phone_ext: string = "";
  // default country for phone input
  public selectedCountry: any = this.phoneMaskService.defaultCountry;
  public selectedCountryPhoneExt: any = this.phoneMaskService.defaultCountry;
  public phoneMask: any = this.phoneMaskService.defaultTextMask;
  
  public uploadedImage: any;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };
  
  public selectedRole = '';
  public permissionArr: any;
  public rolesArr: any;
  public roleDirty: boolean = false;
  public showCustomRole: boolean = false;
  public addPresetForm: boolean = false;
  public preset: any = {};
  
  
  @ViewChild('tabProfile') tabProfile: ElementRef;
  @ViewChild('tabPermissions') tabPermissions: ElementRef;
  @ViewChild('tabTemplate') tabTemplate: ElementRef;
  public userId: string;
  public deleteUser$: ReplaySubject<any> = new ReplaySubject(1);
  
  constructor(
    public router:Router,
    public zone: NgZone,
    public userService: UserService,
    public accountService: AccountService,
    public phoneMaskService: PhoneMaskService,
    public route: ActivatedRoute,
    public toasterService: ToasterService,
    public location: Location,
    public fileUploadService: FileUploadService,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {
    
    this.user = new UserModel();
    
  }
  
  ngOnInit() {
    
    this.locations$ = Observable
    .combineLatest(
      this.userService.selfData$,
      this.locationCheckboxes$
    )
    .filter(([user, checkbox]) => {
      return user.id;
    })
    .map(([selfData, checkboxes]) => {
      this.locationArr = selfData.account.locations;
      
      // set default location for new user or selfData (current user)
      if (!this.user.default_location || this.user.default_location == '') {
        let primaryLoc = _.find(this.locationArr, {'location_type': 'Primary'});
        let onlyLoc = this.locationArr.length == 1 ? this.locationArr[0]['id'] : null;
        this.user.default_location = primaryLoc ? primaryLoc['id'] : onlyLoc;
      }
      
      for (let i = 0; i < this.locationArr.length; i++) {
        if (!this.user.locations[i]) {
          this.locationArr[i].checkbox = this.user.default_location == this.locationArr[i].id ? true : false;
          this.user.locations[i] = {location_id: this.locationArr[i].id, checked: this.locationArr[i].checkbox};
        }
        else {
          this.locationArr[i].checkbox = this.user.default_location == this.locationArr[i].id ? true : this.user.locations[i].checked || false;
          this.user.locations[i] = {location_id: this.locationArr[i].id, checked: this.locationArr[i].checkbox};
        }
      }
      
      return this.locationArr;
    });
  
    this.subscribers.usersSubscription = Observable.combineLatest(
      this.route.params,
      this.userService.selfData$
    )
    .filter(([id, user]) => {
      return user.id;
    })
    .map(([params, selfData]) => {
      this.userId = params['id'];
      return selfData.account.users;
    })
    .subscribe(user => {
      let userArr = _.filter(user, (us: any) => (us.id == this.userId));
      let userData = !_.isEmpty(userArr) ? userArr[0] : {} || {tutorial_mode: true};
      this.user = new UserModel(userData);
      if (!_.isEmpty(userArr)) {
        this.uploadedImage = this.user.avatar;
        this.profileFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.user.phone);
        this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.user.phone);
        this.phone_ext = this.user.phone_ext;
        if (!this.user.template) {
          this.user.template = this.userService.selfData.account.purchase_order_template;
        }
      }
    });
  
    this.departmentCollection$ = this.accountService.getDepartments().take(1);
    this.subscribers.departmentCollectionSubscription = this.departmentCollection$
    .subscribe(departments => this.departmentCollection = departments);
    
    this.subscribers.getRolesSubscription = this.userService.selfData$
    .subscribe((res: any) => {
      if (res.account) {
        
        this.permissionArr = _.cloneDeep(res.permissions);
        this.rolesArr = res.account.roles;
        if (!this.user || !this.user['id']) {
          this.setDefaultPermissions();
        } else {
          if (this.user.permissions[0]) {
            this.permissionArr = this.user.permissions;
            _.each(this.rolesArr, (roleItem: any) => {
              if (_.isEqual(roleItem.permissions, this.permissionArr)) {
                this.selectedRole = roleItem.role;
              }
            });
          } else {
            this.setDefaultPermissions();
          }
        }
      }
    });
  
    this.subscribers.deleteUserSubscription = this.deleteUser$
    .switchMap(() => this.accountService.deleteUser(this.user))
    .subscribe((res: any) =>
        this.goBack(),
      (err: any) =>
        this.goBack()
    );
  }
  
  ngOnDestroy() {
    this.subscribers.usersSubscription.unsubscribe();
  }
  
  setDefaultPermissions() {
    this.permissionArr.map((data: any) => {
      data.default = false;
      return data;
    });
  }
  
  
  changeLocation(event) {
    this.locationDirty = true;
    
    for (let i = 0; i < this.locationArr.length; i++) {
      this.user.locations[i].checked = this.locationArr[i].id == event.target.value ? true : this.user.locations[i].checked || false;
    }
    
    this.locationCheckboxes$.next(this.user.locations);
  }
  
  changeLocationCheckbox(event, i) {
    this.user.locations[i].checked = event.target.checked;
    this.locationCheckboxes$.next(this.user.locations);
  }
  
  changeDepartment() {
    this.departmentDirty = true;
  }
  
  
  onCountryChange($event) {
    this.selectedCountry = $event;
  }
  
  changeListener($event): void {
    this.fileToDataURL($event.target);
  }
  
  fileToDataURL(inputValue: any): void {
    let file: File = inputValue.files[0];
    let myReader: FileReader = new FileReader();
    
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
    let img = new Image();
    img.onload = () => {
      let resizedImg: any = this.fileUploadService.resizeImage(img, {resizeMaxHeight: 500, resizeMaxWidth: 500});
      let orientation = this.fileUploadService.getOrientation(imgBase64);
      let orientedImg = this.fileUploadService.getOrientedImageByOrientation(resizedImg, orientation);
      
      this.zone.run(() => {
        this.uploadedImage = orientedImg;
      });
    };
    img.src = imgBase64;
  }
  
  toggleTutorialMode() {
    this.user.tutorial_mode = !this.user.tutorial_mode;
  }
  
  onRoleChange(event: any = false) {
    let newRole;
    if (event) {
      newRole = event.target.value;
    } else {
      newRole = this.selectedRole;
    }
    _.each(this.rolesArr, (roleItem: any) => {
      if (roleItem.role == newRole) {
        this.permissionArr = _.cloneDeep(roleItem.permissions);
      }
    });
  }
  
  togglePreset(i) {
    let z = 0;
    this.permissionArr[i].default = !this.permissionArr[i].default;
    _.each(this.rolesArr, (roleItem: any) => {
      if (_.isEqual(roleItem.permissions, this.permissionArr)) {
        this.selectedRole = roleItem.role;
        this.showCustomRole = false;
        z++;
      }
    });
    // show role Custom if no matches
    if (z == 0) {
      this.showCustomRole = true;
      this.selectedRole = 'custom';
    }
  }
  
  showAddPresetForm() {
    if (this.showCustomRole) {
      this.addPresetForm = true;
    }
  }
  
  hideAddPresetForm() {
    this.preset.role = '';
    this.addPresetForm = false;
  }
  
  addRole() {
    if (!this.preset.role || this.preset.role == '') {
      this.toasterService.pop('error', 'Pre-set name is required');
      return;
    }
    this.preset.account_id = this.userService.selfData.account_id;
    this.preset.permissions = this.permissionArr;
    this.subscribers.addRoleSubscription = this.accountService.addRole(this.preset)
    .subscribe((res: any) => {
      _.each(res.data.roles, (roleItem: any) => {
        if (roleItem.label == this.preset.role) {
          this.selectedRole = roleItem.role;
        }
      });
      this.addPresetForm = false;
      this.preset = {};
      this.showCustomRole = false;
      this.onRoleChange();
    });
  }
  
  onSubmit() {
    
    this.user.account_id = this.userService.selfData.account_id;
    this.user.phone = this.selectedCountry[2] + ' ' + this.profileFormPhone;
    this.user.phone_ext = this.phone_ext;
    this.user.avatar = this.uploadedImage;
    this.user.permissions = this.permissionArr;
    
    console.log(this.user);
    this.subscribers.addUserSubscription = this.accountService.addUser(this.user)
    .subscribe(
      (res: any) => {
        this.goBack();
      },
      (err: any) => {
        this.goBack();
      }
    );
  }
  
  nextTab() {
    if (this.tabProfile.nativeElement.className == 'active')
      this.tabPermissions.nativeElement.click();
    else this.tabTemplate.nativeElement.click();
  }
  
  prevTab() {
    if (this.tabTemplate.nativeElement.className == 'active')
      this.tabPermissions.nativeElement.click();
    else this.tabProfile.nativeElement.click();
  }
  
  deleteUser(user) {
    this.modalWindowService.confirmModal('Delete user?', {text: 'Are you sure you want to delete the user?', btn: 'Delete'}, this.deleteUserFunc.bind(this));
  }
  
  deleteUserFunc() {
    this.deleteUser$.next('');
  }
  
  changePassword() {
    this.modal
    .open(ChangePasswordUserModal, this.modalWindowService.overlayConfigFactoryWithParams({user: this.user}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
        },
        (err) => {
        }
      );
    });
  }
  
  goBack(): void {
    this.router.navigate(['/users']);
  }
  goBackOneStep(): void {
    this.location.back();
  }
  
}
