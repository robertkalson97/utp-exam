import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import QrCode from 'qrcode-reader';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})

@DestroySubscribers()
export class QrScannerComponent implements OnInit, OnDestroy {
  subscribers: any = {};
  codeImg: string = '';
  
  src$: Subject<string> = new Subject();
  file$: Subject<File> = new Subject();
  
  @Input() file;
  
  @Output() codeUpdated = new EventEmitter();
  
  constructor(
    private ngZone: NgZone
  ) {
    this.file$
    .filter(res => !!res)
    .subscribe((file) => {
      this.codeImg = URL.createObjectURL(file);
      this.src$.next(this.codeImg);
    })
  }
  
  ngOnInit() {
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.file$.next(changes.file.currentValue);
  }
  
  addSubscribers() {
    this.subscribers.srcSubscriber = this.src$
    .subscribe((code: any) => {
      let qr = new QrCode();
      qr.decode(code);
      
      qr.callback = (err, src) => {
        let result = src? src.result : null;
        this.ngZone.run(() => {
          this.codeUpdated.emit(result);
        });
      };
      
    })
  }
  
}