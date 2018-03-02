import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../core/services/index';
import { ProductFilterModal } from '../products/product-filter-modal/product-filter-modal.component';
import { Modal } from 'angular2-modal';
import { ModalWindowService } from '../../core/services/modal-window.service';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  public searchKey: string;

  constructor(
    public vendorService: VendorService,
    public modal: Modal,
    public modalWindowService: ModalWindowService,
  ) {
  }

  ngOnInit() {

  }

  vendorsSearch(event) {
    this.vendorService.updateSearchKey(event);
  }

  resetSearch() {
    this.searchKey = '';
    this.vendorService.updateSearchKey('');
  }

  selectTab(currentTab) {
    this.vendorService.updateSortBy('A-Z');
    this.vendorService.updateVendorsData(currentTab);
  }

  showFiltersModal() {
    this.modal
    .open(ProductFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          // this.filterProducts();
        },
        (err) => {
        }
      );
    });
  }

}
