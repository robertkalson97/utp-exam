import {
  AfterViewInit, Component, EventEmitter, forwardRef, Input, NgZone, Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { isArray, reject, map, unionBy } from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

export const CHIP_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ChipsInputComponent),
  multi: true,
};

export interface ChipMaterializeParams {
  data?: Chip[];
  placeholder?: string;
  secondaryPlaceholder?: string;
  autocompleteData?: any;
  autocompleteLimit?: number;
}

export interface Chip {
  tag: string;
  image?: string;
  id?: string | number;
}

@Component({
  selector: 'app-chips-input',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  providers: [CHIP_INPUT_VALUE_ACCESSOR],
})
@DestroySubscribers()
export class ChipsInputComponent implements ControlValueAccessor, AfterViewInit {

  public isDisabled$ = new BehaviorSubject<boolean>(false);
  public isDisabled: boolean;

  public materializeParams: ChipMaterializeParams = {};

  public chips: Chip[] = [];

  public chipActions = new EventEmitter();

  public onChange;
  public onTouched;

  @Input()
  set placeholder(placeholder: string) {
    this.updateMaterializeParams({placeholder});
  }

  @Input()
  set secondaryPlaceholder(secondaryPlaceholder: string) {
    this.updateMaterializeParams({secondaryPlaceholder});
  }

  @Input()
  set disabled(value) {
    this.setDisabledState(value);
  }

  @ViewChild('chips') chipsEl;

  private subscribers: any = {};

  constructor(
    private renderer: Renderer2,
    private ngZone: NgZone
  ) {
  }

  get rawChips() {
    return map(this.chips, 'tag');
  }

  get chipsInput() {
    if (this.chipsEl && this.chipsEl.nativeElement) {
      const el = this.chipsEl.nativeElement;
      return el.lastElementChild || null;
    }
    return null;
  }

  ngAfterViewInit() {
    this.subscribers.isDisabledSubscribtion = this.isDisabled$
    .filter(() => this.chipsInput)
    .delayWhen(() => this.ngZone.onMicrotaskEmpty.take(1))
    .subscribe((isDisabled) => {
      this.setnputDisability(isDisabled);
    });
  }

  public onDelete({detail}: { detail: Chip }) {
    if (!this.isDisabled) {
      this.chips = reject(this.chips, ['tag', detail.tag]);
      this.onChange(this.rawChips);
    }
  }

  public onAdd({detail}: {detail: Chip}) {
    if (!this.isDisabled) {
      this.chips = unionBy(this.chips, [detail], 'tag');
      this.onChange(this.rawChips);
    }
  }

  public onFocus(hasFocusClass) {
    if (hasFocusClass) {
      this.onTouched();
    }
  }

  public writeValue( value: string[] ): void {
    this.chips = this.chipsTransform(value);
    this.updateMaterializeParams({data: this.chips});
    this.setDisabledState(this.isDisabled);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.isDisabled$.next(isDisabled);
  }

  private chipsTransform(chips: string[]): Chip[] {
    if (isArray(chips)) {
      return chips.map((chip) => ({tag: chip}));
    }
    return [];
  }

  private updateMaterializeParams(params: ChipMaterializeParams) {
    this.materializeParams = {
      ...this.materializeParams,
      ...params,
    };
    this.chipActions.emit(this.materializeParams);
  }

  private setnputDisability(disable: boolean) {
    if (disable) {
      this.renderer.setAttribute(this.chipsInput, 'disabled', '');
    } else {
      this.renderer.removeAttribute(this.chipsInput, 'disabled');
    }
  }
}
