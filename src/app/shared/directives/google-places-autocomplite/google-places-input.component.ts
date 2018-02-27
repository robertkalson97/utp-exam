import { Observable, Subject } from "rxjs";
declare let google: any;

import {
  Directive,
  Component,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  ViewChild
} from '@angular/core';


import * as _ from 'lodash';
import { MapsAPILoader } from "angular2-google-maps/core";
import { FormControl } from "@angular/forms";
import { DestroySubscribers } from "ng2-destroy-subscribers";


@Directive({
  selector: '[googlePlacesInput]',
})
@DestroySubscribers()
export class GooglePlacesInputComponent implements OnInit {

  public autocomplete;
  public googlePlaceAdrress$;
  public subscribers: any = {};

  @Output() googleAdress = new EventEmitter();

  constructor(public mapsAPILoader: MapsAPILoader, public el: ElementRef) {
    el.nativeElement.autocomplete = "off";
    el.nativeElement.autocapitalize = "off";
    el.nativeElement.spellcheck = "off";

  }

  ngOnInit() {

    // Observable.fromEvent(this.el.nativeElement, "keydown")
    //   .filter(event => event.keyCode == 13)
    //   .subscribe(event => event.stopPropagation());

    this.googlePlaceAdrress$ = Observable.fromPromise(this.mapsAPILoader.load()).switchMap(() => {
      this.autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement, {
        types: ["address"]
      });
      return Observable.fromEventPattern(
        (h)=> {
          this.autocomplete.addListener("place_changed", h)
        },
        (h)=> {
          this.autocomplete.unbindAll()
        }
      )
        .switchMap(res => {
          return Observable.of(Object.assign(this.autocomplete.getPlace(),{ inputValue: this.el.nativeElement.value }));
        });
    });

  }

  addSubscribers() {
    this.subscribers.googlePlaceAdrress = this.googlePlaceAdrress$.subscribe(res => {
      this.googleAdress.emit(res);
    });
    this.subscribers.stopPropogotationFromEnter =  Observable.fromEvent(this.el.nativeElement, "keydown")
      .filter((event: any) => event.keyCode == 13)
      .subscribe((event: any) => {
        event.preventDefault();
        event.stopPropagation();
      });

  }
}
