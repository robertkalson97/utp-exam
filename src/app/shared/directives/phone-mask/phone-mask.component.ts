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

import { PhoneMaskService } from '../../../core/services/index';

@Component({
  selector: 'phone-input',
  templateUrl: './phone-mask.component.html',
  styleUrls: ['./phone-mask.component.scss'],
  host: {
    '(document: mousedown)': 'onDocumentClick($event)',
    '(document: keypress)': 'onKeyPress($event)'
  }
})
export class IntlPhoneMaskDirective implements OnInit {
  public element: ElementRef;

  @Input() selectedCountry: any = [ "United States", "us", "1", 0 ];
  @Output('onCountryChange') countryChangeEvent = new EventEmitter();
  @ViewChild('countryParent') countryWrapper: ElementRef;

  public input = {};
  // public selectedCountry: any = [];
  public viewCountryList: boolean = false;
  public allCountries = [];

  // TODO: remove after accepting intl phone number functionality
  // someDynamicHtml =
  //   '<div class="flag-container">' +
  //   '<div class="selected-flag" (click)="viewCountryList = !viewCountryList">' +
  //   '<div class="iti-flag {{selectedCountry[1]}}"></div>' +
  //   '<div class="iti-arrow"></div>' +
  //   '</div>' +
  //   '<ul class="country-list" [class.hide]="!viewCountryList">' +
  //   '<li class="country" [class.highlight]="country[1] == selectedCountry[1]" *ngFor="let country of allCountries" (click)="selectCountry(country)">' +
  //   '<div class="flag-box"><div class="iti-flag {{country[1]}}"></div></div>' +
  //   '<span class="country-name">{{country[0]}}</span>' +
  //   '<span class="dial-code">+{{country[2]}}</span>' +
  //   '</li>' +
  //   '</ul>' +
  //   '</div>';

  public constructor(
    element: ElementRef,
    phoneMaskService: PhoneMaskService
  ) {
    this.element = element;
    this.allCountries = phoneMaskService.allCountries;
  }

  ngOnInit(){
    // TODO: remove after accepting intl phone number functionality
    // this.wrap(this.element.nativeElement);
  }

  // TODO: remove after accepting intl phone number functionality
  // wrap (toWrap) {
  //   let self = this;
  //   let wrapper = document.createElement('div');
  //   wrapper.className = "intl-tel-input allow-dropdown";
  //   let flagContainer = document.createElement('div');
  //   flagContainer.className = "flag-container";
  //   flagContainer.addEventListener('click', function(){
  //     self.viewCountryList = !self.viewCountryList;
  //   });
  //   // wrapper.innerHTML = this.someDynamicHtml;
  //   if (toWrap.nextSibling) {
  //     toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);
  //   } else {
  //     toWrap.parentNode.appendChild(wrapper);
  //   }
  //   return wrapper.appendChild(toWrap);
  // }

  onViewCountryList(){
    this.viewCountryList = !this.viewCountryList;
    let selectedCountryEl = document.getElementById('country'+this.selectedCountry[1]);
    setTimeout(()=>{
      this.countryWrapper.nativeElement.scrollTop = selectedCountryEl.offsetTop;
    }, 100);
  }

  onKeyPress(event){
    if (!this.viewCountryList){
      return;
    }

    let key = null, countryKey = null;
    if (new RegExp('[A-z]', 'gi').test(event.key)){
      key = event.key;
    }

    if (!key) return;

    _.each(this.allCountries, (country, cKey) => {
      if (!countryKey && new RegExp(key, 'gi').test(country[0].split('')[0]))
        countryKey = country[1];
    });

    let selectedCountryEl = this.element.nativeElement.getElementsByClassName('country_'+countryKey)[0];
    this.countryWrapper.nativeElement.scrollTop = selectedCountryEl.offsetTop;
  }

  selectCountry(country){
    this.selectedCountry = country;

    this.viewCountryList = false;
    this.countryChangeEvent.emit(this.selectedCountry);
  }

  onDocumentClick($event){
    if (!this.element.nativeElement.contains($event.target)) 
      this.viewCountryList = false;
  }

}
