import { Component, Input, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { SpinnerService } from '../core/services/spinner.service';

@Component({
  selector: 'app-spinner',
  styleUrls: [ './spinner.style.scss' ],
  templateUrl: './spinner.template.html'
})
export class SpinnerComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public subscription: any;

  constructor (
      public el: ElementRef,
      public spinnerService: SpinnerService
  ){}

  ngOnInit(){
    this.subscription = this.spinnerService.loading$.subscribe(res => {
      this.toggleLoadingIndicator(res);
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  toggleLoadingIndicator(loading){
    this.isLoading = loading;
    if (this.isLoading) this.playLoadingAnimation();
  }

  playLoadingAnimation(){

  }
}