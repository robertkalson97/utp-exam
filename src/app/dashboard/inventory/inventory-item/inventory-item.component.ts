import { Component, OnInit, AfterViewInit, NgZone, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Modal } from 'angular2-modal';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Observable, BehaviorSubject, Subject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Location }                 from '@angular/common';
import { UserService, AccountService } from '../../../core/services/index';
import { ModalWindowService } from "../../../core/services/modal-window.service";
import { ToasterService } from "../../../core/services/toaster.service";
import { EditCommentModal } from "../../../shared/modals/edit-comment-modal/edit-comment-modal.component";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigService } from '../../../core/services/config.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { InfoModal } from './default-info-modal/info-modal-component';
import { AddInventoryModal } from '../add-inventory/add-inventory-modal.component';
import { AddInventory2OrderModal } from './add-inventory-2order-modal/add-inventory-2order-modal.component';

@Component({
  selector: 'app-inventory-item-modal',
  templateUrl: './inventory-item.component.html',
  styleUrls: ['./inventory-item.component.scss']
})
@DestroySubscribers()
export class InventoryItemComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public currentVariant: any = {};
  public showVariant: boolean = false;
  public comment: any = {};
  public showEdit: boolean = false;
  public orders$: BehaviorSubject<any> = new BehaviorSubject([]);
  public showEdit$: BehaviorSubject<any> = new BehaviorSubject([]);
  public comments$ = new BehaviorSubject([]);
  public addToComments$ = new Subject();
  public deleteFromComments$ = new Subject();
  public editCommentComments$ = new Subject();
  public filteredComments$;
  public location_id;
  public currentLocation: any = {};
  public canEdit:boolean = false;
  public inventory_id: string;
  public favorite: boolean;
  public locationArr: any;
  public product$: any = new BehaviorSubject<any>(null);
  public inventory: any;
  public updateFavorite$: any = new Subject();
  public deleteInventory$: any = new Subject();
  public selectedLocation: boolean = false;
  public selectedTab: string = 'info';

  @ViewChild('info') info: ElementRef;
  @ViewChild('locations') locations: ElementRef;
  @ViewChild('history') history: ElementRef;
  @ViewChild('tracking') tracking: ElementRef;
  @ViewChild('products') products: ElementRef;
  @ViewChild('comments') comments: ElementRef;

  constructor(
    public userService: UserService,
    public accountService: AccountService,
    public configService: ConfigService,
    public InventoryService: InventoryService,
    public toasterService: ToasterService,
    public location: Location,
    public route: ActivatedRoute,
    public router: Router,
    public zone: NgZone,
    public modalWindowService: ModalWindowService,
    public modal: Modal
  ) {
    this.showEdit$.next(false);
  }

  ngOnInit() {

    let addToComments$ = this.addToComments$
    .switchMap(comment =>
      this.InventoryService.addInventoryItemComment(this.comment)
      .catch(err => Observable.empty())
    )
    .switchMap((item: any) => {
      return this.comments$.first().map(collection => {
        collection.unshift(item);
        return collection;
      })
    });

    let deleteFromComments$ = this.deleteFromComments$
    .switchMap(commentId => {
      return this.InventoryService.deleteInventoryItemComment(commentId)
      .catch(err => Observable.empty())
      .do(res => {
        this.toasterService.pop("", res.message)
      })
      .mapTo(commentId)
      }
    )
    .switchMap((id: any) => {
      return this.comments$.first().map(collection => {
        _.remove(collection, {id: id});
        return collection;
      })
    });

    let editCommentComments$ = this.editCommentComments$
    .switchMap((resultPromise: Promise<string>) =>
      Observable.fromPromise(resultPromise)
      .catch(err => Observable.empty())
    )
    .switchMap(comment =>
      this.InventoryService.editInventoryItemComment(comment)
      .pluck('data')
    )
    .switchMap((commentToUpdate: any) =>
      this.comments$
      .first()
      .map(collection =>
        collection.map((comment: any) =>
          comment.id === commentToUpdate.id ? commentToUpdate : comment
        )
      )
    );

    this.filteredComments$ = Observable.merge(
      this.comments$,
      addToComments$,
      deleteFromComments$,
      editCommentComments$
    ).map(comments => {
      let filteredComments = _.map(comments, (item: any) => {
        if (item.body) {
          let regKey = new RegExp('(?:\r\n|\r|\n)', 'g');
          item.body = item.body.replace(regKey, "<br/>"); // adding many lines comment
        }

        if (item.created_at) {
          let date = new Date(item.created_at);
          item.created_at = date.toDateString();
        }

        return item;
      });
      return _.orderBy(filteredComments, (item: any) => {
        return new Date(item.created_at)
      }, ['desc'])
    });

    this.subscribers.getLocationArraySubscription = this.accountService.locations$.subscribe(
      r => {
        this.locationArr = r;
      }
    );

  }

  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  addSubscribers() {

    this.getCurrentInventory();

    this.subscribers.selectLocationSubscription = Observable.combineLatest(this.accountService.dashboardLocation$, this.product$)
    .filter(([location, product]: any) => {
      return (location && product);
    })
    .switchMap(([location, product]: any) => {
      return product.inventory_item_locations.map(inventoryLocation => {
        if (location.id === inventoryLocation.location_id) {
          product.critical_level = inventoryLocation.critical_level;
          product.overstock_level = inventoryLocation.overstock_level;
          product.fully_stocked = inventoryLocation.fully_stocked;
          product.storage_locations = inventoryLocation.storage_locations;
          product.pending = inventoryLocation.pending;
          product.on_hand_combined = inventoryLocation.on_hand;
        }
      });
    }).subscribe();

    this.subscribers.environmentSubscription = this.configService.environment$
    .filter((a:string)=>a=='development')
    .subscribe((a)=> {
      this.canEdit = true;
    });

    this.subscribers.updateFavouriteSubscription = this.updateFavorite$
    .switchMap(() => {
      let inventory = {
        inventory_id: this.inventory_id,
        favorite: this.favorite
      };
      return this.InventoryService.setFavorite(inventory)})
    .subscribe(res => {
        this.InventoryService.updateInventoryCollection(res);
        this.getCurrentInventory();
        this.toasterService.pop('', res.favorite ? 'Added to favorites' : "Removed from favorites");
      },
      err => console.log('error')
    );

    this.subscribers.deleteInventorySubscription = this.deleteInventory$
    .switchMap(() => {return this.product$ })
    .switchMap(inventory => this.InventoryService.deleteInventory(inventory))
    .subscribe(
      res =>
        this.goBack()
      ,
      err => console.log('error')
    );
  }

  ngAfterViewInit() {
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$
    .subscribe(location => {
      this.location_id = location ? location['id'] : null;

      if (location && this.selectedTab === 'locations') {
        this.info.nativeElement.click();
      } else {
        setTimeout(() => {
          this[this.selectedTab].nativeElement.click();
        },0);
      }
    });
  }

  selectInventoryTab(tab) {
    this.selectedTab = tab;
  }

  getCurrentInventory() {
    this.subscribers.getInventorySubscription = this.route.params
    .switchMap((p:Params)=>this.InventoryService.getInventoryItem(p['id']))
    .subscribe((a:any)=> {
      this.inventory = a;
      this.inventory_id = a.id;
      this.favorite = a.favorite;
      this.product$.next(a);
      this.comments$.next(a.comments); // update comments
    });
  }

  dismissModal() {
    this.InventoryService.getNextInventory(this.InventoryService.current_page, '', '');
  }

  closeModal(data) {
  }

  sendComment() {
    Object.assign(this.comment,
      {
        "user_id": this.userService.selfData.id,
        "object_type": "inventory_item",
        "object_id": this.inventory_id
      }
    );
    this.addToComments$.next(this.comment)
  }

  editComment(comment) {
    let clonedComment = _.cloneDeep(comment);
    if (clonedComment.body) {
      let regKey = new RegExp('<br/>', 'g');
      clonedComment['body'] = clonedComment.body.replace(regKey, "\r\n"); // replacing <br/> many lines comment
    }
    this.modal.open(
      EditCommentModal,
      this.modalWindowService.overlayConfigFactoryWithParams({comment: clonedComment})
    )
    .then((resultPromise) => {
      this.editCommentComments$.next(resultPromise.result);
    });
  }
  deleteComment(comment) {
    this.modalWindowService.confirmModal(
      'Delete Comment?', {text: 'Are you sure you want to delete this comment?', btn: 'Delete'},
      this.deleteCommentFunc.bind(this, comment.id)
    );
  }

  deleteCommentFunc(id) {
    this.deleteFromComments$.next(id);
  }

  reformatOrderHistory(ina: any): any {
    let out: any = [];
    _.map(ina, vnt =>
      _.map(vnt['inventory'], inv =>
        _.map(inv['orders'], ord => {
            ord['variant_name'] = vnt['name'];
            ord['variant_id'] = vnt['id'];
            out.push(ord);
          }
        )
      )
    )
    return out;
  }

  goBack(): void {
    if (this.showVariant) {
      this.showVariant = false;
      this.currentVariant = {};
    } else {
      this.location.back();
    }
  }

  hideVariantDetails() {

  }

  defaultInfoModal() {
    this.modal
    .open(InfoModal, this.modalWindowService
    .overlayConfigFactoryWithParams({"text": 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea c'}, true, 'mid'))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {},
        (err) => {}
      );
    });
  }

  setFavorite(e) {
    e.stopPropagation();
    this.updateFavorite$.next();
  }

  deleteInventory() {
    this.modalWindowService.confirmModal('Delete inventory?', {text: 'Are you sure you want to delete the inventory?', btn: 'Delete'}, this.deleteInventoryFunc.bind(this));
  }

  deleteInventoryFunc() {
    this.deleteInventory$.next();
  }

  openAddInventoryModal(){
    this.subscribers.getProductSubscriber = this.product$
    .take(1)
    .subscribe((inventory)=>{
      let data = {
        inventoryGroup:inventory
      };
    this.modal
    .open(AddInventoryModal, this.modalWindowService.overlayConfigFactoryWithParams({'inventoryGroup': data, 'inventoryItems':[]}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          //this.product$.next(res);
          // TODO don't make request again
          // again request because not all fields are returned after updating
          this.getCurrentInventory();
        },
        (err) => {}
      );
    });
    });
  }

  addToOrder() {
    this.modal
    .open(
      AddInventory2OrderModal,
      this.modalWindowService.overlayConfigFactoryWithParams(
        {
          data: {
            'inventory': this.inventory,
            'location_id': this.location_id,
            'locations': this.locationArr
          }
        },
        true
      )
    ).then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
        },
        (err) => {
        }
      );
    });
  }

  printPage() {
    window.print();
  }
  
}
