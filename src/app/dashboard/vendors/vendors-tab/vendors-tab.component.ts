import { Component, HostListener, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { VendorService } from '../../../core/services/vendor.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {AddVendorModalComponent} from '../../../shared/modals/add-vendor-modal/add-vendor-modal.component';
import {Modal} from 'angular2-modal';
import {ModalWindowService} from '../../../core/services/modal-window.service';

@Component({
  selector: 'app-vendors-tab',
  templateUrl: './vendors-tab.component.html',
  styleUrls: ['./vendors-tab.component.scss']
})

@DestroySubscribers()
export class VendorsTabComponent implements OnInit {
  public subscribers: any = {};

  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public searchKey: string;
  public searchKeyLast: string;
  public sortBy: string = 'A-Z';
  public sortBy$: any = new BehaviorSubject('A-Z');
  public total: number;

  public isRequestVendors: boolean = false;
  public infiniteScroll$: any = new BehaviorSubject(false);
  public vendors$: Observable<any>;
  public vendors: any;

  constructor(
    public vendorService: VendorService,
    public modal: Modal,
    public modalWindowService: ModalWindowService,
  ) {
  }

  ngOnInit() {
    this.vendors$ = this.vendorService.combinedVendors$;
  }

  addSubscribers() {
    this.subscribers.infiniteSccrollSubscription = this.infiniteScroll$
    .filter((infinite) => infinite && !this.isRequestVendors)
    .switchMap((infinite) => {
      this.isRequestVendors = true;
      this.searchKeyLast = this.searchKey;

      if (this.total <= (this.vendorService.current_page) * this.vendorService.pagination_limit) {
        this.isRequestVendors = false;
        return Observable.of(false);
      } else {
        if (this.searchKey === this.searchKeyLast) {
          ++this.vendorService.current_page;
        }
        return this.vendorService.getNextVendors(this.vendorService.current_page);
      }
    })
    .subscribe(res => {
    }, err => {
      console.log(err);
    });

    this.subscribers.isVendorDataLoadedSubscription = this.vendorService.isDataLoaded$
    .filter(r => r)
    .do(() => this.isRequestVendors = false)
    .delay(1000)
    .subscribe((r) => {
      this.getInfiniteScroll();
    });

    this.subscribers.totalCountSubscription = this.vendorService.totalCount$
    .subscribe(total => this.total = total);
  }

  vendorsSort(event) {
    const value = event.target.value;
    this.vendorService.updateSortBy(value);
  }

  getInfiniteScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const toBottom = document.body.scrollHeight - scrollTop - window.innerHeight;
    const scrollBottom = toBottom < 285;
    this.infiniteScroll$.next(scrollBottom);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.getInfiniteScroll();
  }

  openAddVendorsModal() {
    this.modal
      .open(AddVendorModalComponent, this.modalWindowService.overlayConfigFactoryWithParams({}, true))
      .then((resultPromise) => {
        resultPromise.result.then(
          (res) => {
            // this.updateCollectionCustomProduct$.next(true);
          },
          (err) => {
          }
        );
      });
  }
}
