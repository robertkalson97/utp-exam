import { AfterViewInit, Component } from '@angular/core';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { Modal } from 'angular2-modal';
import { NewsModal } from './news-modal/news-modal.component';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-inner-dashboard',
  templateUrl: './inner-dashboard.component.html',
  styleUrls: ['./inner-dashboard.component.scss']
})
@DestroySubscribers()
export class InnerDashboardComponent implements AfterViewInit {
  
  constructor(
    public modalWindowService: ModalWindowService,
    public modal: Modal,
    public dashboardService: DashboardService
  ) {
  }
  
  ngAfterViewInit() {
    this.dashboardService.selfData$
    .subscribe(() => {
        if (this.dashboardService.hasInfo) {
          this.showInfo();
        }
      }
    );
  }
  
  showInfo() {
    this.dashboardService.hasInfo = false;
    this.modal.open(NewsModal, this.modalWindowService.overlayConfigFactoryWithParams({text: this.dashboardService.dashboardText}, false, 'big'));
  }
}
