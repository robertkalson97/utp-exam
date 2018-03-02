import {
  ApplicationRef, Directive, ElementRef, EventEmitter, HostBinding, Input, NgZone, OnDestroy, OnInit,
  Output
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Directive({
  selector: '[appHasClass]',
})
export class HasClassDirective implements OnInit, OnDestroy {

  @Input() appHasClass: string;

  @HostBinding('class')
  get class() {
    const classList = this.el.nativeElement.classList;

    if (!this.appHasClass) {
      throw new Error('Class to watch must be present');
    }

    this.classChange$.next(classList.contains(this.appHasClass));
    return '';
  }

  @Input() hasClass;

  @Output() hasClassChange = new EventEmitter();

  private classChange$ = new Subject();
  private classChangedSubscribtion: Subscription;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
  ) {
  }

  ngOnInit() {
    this.classChangedSubscribtion = this.classChange$
    .distinctUntilChanged()
    // Strange Behavior higher that throws expresion change after check. Next line resolves it.
    .delayWhen(() =>
      this.ngZone.onMicrotaskEmpty
    )
    .subscribe((contains) => {
      this.hasClassChange.emit(contains);
    });
  }

  ngOnDestroy() {
    if (this.classChangedSubscribtion && this.classChangedSubscribtion.unsubscribe) {
      this.classChangedSubscribtion.unsubscribe();
    }
  }


}
