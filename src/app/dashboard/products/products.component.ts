import { Component, OnInit } from '@angular/core';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

import { ProductFilterModal } from './product-filter-modal/product-filter-modal.component';
import { ProductService } from '../../core/services/index';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { AccountService } from '../../core/services/account.service';
import { UploadCsvModal } from './upload-csv-modal/upload-csv-modal.component';
import { ToasterService } from '../../core/services/toaster.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
@DestroySubscribers()
export class ProductsComponent implements OnInit {
  public nothingChecked: boolean;
  
  public dashboardLocation;
  public searchKey: string;
  public searchKeyLast: string;
  public locationId: string;
  private subscribers: any;
  public test: string;
  
  constructor(
    public modal: Modal,
    public productService: ProductService,
    public modalWindowService: ModalWindowService,
    public accountService: AccountService,
    public toasterService: ToasterService
  ) {
  }
  
  ngOnInit() {
  }
  
  searchProducts(event) {
    this.productService.updateSearchKey(event);
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
  
  showUploadDialog() {
    this.modal
    .open(UploadCsvModal, this.modalWindowService.overlayConfigFactoryWithParams({}, true))
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
  
  resetFilters() {
    this.searchKey = '';
    this.productService.updateSearchKey('');
  }
  selectTab(tabName) {
    this.productService.updateSortBy('A-Z');
    this.productService.updateMarketplaceData(tabName);
  }
}
