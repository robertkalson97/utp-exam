import {Component, NgZone, OnInit, ViewChild} from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import {Observable} from "rxjs/Observable";
import {ScannerService} from "../../../core/services/scanner.service";

export class VideoModalContext extends BSModalContext {
  public video: any;
}


@Component({
  selector: 'video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss']
})
export class VideoModal implements ModalComponent<VideoModalContext>, OnInit {
  context;

    @ViewChild('canvas') canvas;
    @ViewChild('video') video;

  constructor(
    public dialog: DialogRef<VideoModalContext>,
    public scannerService: ScannerService,
  ) {
    this.context = dialog.context.video;

  }

    ngOnInit() {
        this.scannerService.onStartStream(this.video, this.canvas, this.dialog);
    }

    closeModal() {
        this.scannerService.onStopStrem();
    }
}

