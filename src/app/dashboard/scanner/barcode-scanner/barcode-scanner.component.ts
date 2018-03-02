import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import Quagga from 'quagga';

import { Observable } from 'rxjs/Observable';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})

@DestroySubscribers()
export class BarcodeScannerComponent implements OnInit, OnDestroy {
  subscribers: any = {};
  context;
  quaggaConfig: any;
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
    
    this.quaggaConfig = {
      inputStream: {
        size: 320
      },
      locator: {
        patchSize: "x-large",
        halfSample: true
      },
      numOfWorkers: 1,
      decoder: {
        readers: ['upc_reader', 'ean_reader', 'code_128_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader',
          'codabar_reader', 'upc_e_reader', 'i2of5_reader', '2of5_reader', 'code_93_reader' ],
        multiple: false,
        debug: {
          drawBoundingBox: false,
          showFrequency: false,
          drawScanline: false,
          showPattern: false
        },
      },
      locate: true,
      src: null
    };
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing')
  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.file$.next(changes.file.currentValue);
  }
  
  addSubscribers() {
    this.subscribers.srcSubscriber = this.src$
    .map(src => ({...this.quaggaConfig, src}))
    .switchMap((config) =>
      this.decodeSingle(config)
    )
    .subscribe((code: any) => {
      this.ngZone.run(() => {
        this.codeUpdated.emit(code);
      })
    })
  }
  
  decodeSingle(config) {
    let obs = Observable.create(observer => {
      Quagga.decodeSingle(config, result => {
        if (result && result.codeResult) {
          observer.next(result.codeResult.code);
        } else {
          observer.next(null);
        }
      })
    });
    return obs;
  }
  
}
