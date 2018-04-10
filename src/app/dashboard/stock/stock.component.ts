import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { comparator, equals, gt, prop, sort, sortBy, toLower } from 'ramda';
import { UserService, AccountService } from '../../core/services/index';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { UpdateStockModal } from './update-stock-modal/update-stock-modal.component';
import { StockFilterModal } from './stock-filter-modal/stock-filter-modal.component';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  public sort: string = 'A-Z';
  public filter: string = '';
  public products: Array<any> = [];
  public panel: any = {};
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
  ) {
    this.products = [
      { title: 'Gloves Tender Touch Nitrile Sempecare', countBy: '1 Box (100)', currentQTY: 100, actualQTY: null, reason: 'N/A' },
      { title: 'Gloves Tender Touch Nitrile Sempecare', countBy: '1 Box (100)', currentQTY: 80, actualQTY: null, reason: 'N/A' },
      { title: '20GM Maximum cure sealant a-flouo', countBy: '1 Box (100)', currentQTY: 20, actualQTY: null, reason: 'N/A' },
      { title: '5GM Light bond medium pst-push-fluo', countBy: '1 Box (100)', currentQTY: 8, actualQTY: null, reason: 'N/A' },
      { title: 'A2 Tips', countBy: '1 Box (100)', currentQTY: 12, actualQTY: null, reason: 'N/A' },
    ]
    this.sortAlphabet({});
    this.panel.visible = false;
  }

  ngOnInit() {}

  sortAlphabet(event) {
    if (equals(this.sort, 'A-Z')) {
      const ascComparator = comparator((a, b) => gt(prop('title', b), prop('title', a)));
      this.products = sort(ascComparator, this.products);
    } else {
      const desComparator = comparator((a, b) => gt(prop('title', a), prop('title', b)));
      this.products = sort(desComparator, this.products);
    }
  }

  sortUnit(event) {
    event.currentQTY = Math.round(100 * Math.random());
  }

  filterChange(event) {}

  filtered(product) {
    if (!this.filter) {
      return true;
    }
    return toLower(product.title).indexOf(toLower(this.filter)) > -1;
  }

  actualChange(event) {
    let active = false;
    this.products.forEach(product => {
      if (parseInt(product.actualQTY) > 0) active = true;
    })
    this.panel.visible = active;
  }

  remove(product) {
    product.actualQTY = null;
    product.reason = 'N/A';
    this.actualChange({});
  }

  clear() {
    this.products.forEach(product => {
      product.actualQTY = null;
      product.reason = 'N/A';
    })
    this.panel.visible = false;
  }

  openFilterModal() {
    this.modal
    .open(StockFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({'products': this.products, 'panel': this.panel}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {},
        (err) => {}
      );
    });
  }

  openSuccessModal() {
    this.modal
    .open(UpdateStockModal, this.modalWindowService.overlayConfigFactoryWithParams({'products': this.products, 'panel': this.panel}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {},
        (err) => {}
      );
    });
  }
}
