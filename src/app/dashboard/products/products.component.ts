import { Component, OnInit } from '@angular/core';

import { Modal } from 'angular2-modal/plugins/bootstrap';

import { ProductService } from '../../core/services/index';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { UploadCsvModal } from './upload-csv-modal/upload-csv-modal.component';
import { MarketplaceFiltersComponent } from '../../shared/modals/filters-modal/marketplace-filters/marketplace-filters.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public searchKey: string;
  public test: string;

  constructor(
    public modal: Modal,
    public productService: ProductService,
    public modalWindowService: ModalWindowService,
  ) {
  }

  ngOnInit() {
  }

  searchProducts(event) {
    this.productService.updateSearchKey(event);
  }

  showFiltersModal() {
    this.modal
    .open(MarketplaceFiltersComponent, this.modalWindowService.overlayConfigFactoryWithParams({}));
  }

  showUploadDialog() {
    this.modal
    .open(UploadCsvModal, this.modalWindowService.overlayConfigFactoryWithParams({}, true));
  }

  resetFilters() {
    this.searchKey = '';
    this.productService.updateSearchKey('');
    this.productService.filterBy$.next(null);
  }
  selectTab(tabName) {
    this.productService.updateSortBy('A-Z');
    this.productService.updateMarketplaceData(tabName);
  }
}
