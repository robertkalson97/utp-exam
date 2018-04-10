import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'range-slider',
  templateUrl: './range-slider.component.html',
  styleUrls: ['./range-slider.component.scss'],
})

export class RangeSliderComponent {
  public _product: any = {};

  @Input()
  set product(value: any) {
    this._product = value;
  }

  constructor() {}

  // sets the style of the range-field thumb;
  calcQuantityMargin(product) {
    let valueArr: number[] = [product.on_hand, product.critical_level, product.overstock_level];

    product.max = Math.max(...valueArr);
    product.min = Math.min(...valueArr);

    let quantityMargin = ((product.on_hand - product.critical_level) * 100 / (product.overstock_level - product.critical_level)).toString();
    let thumbColor = this.calcThumbColor(product.on_hand / product.overstock_level );

    let defaultLeft = {'left': '0', 'right': 'inherit'};
    let defaultRight = {'left': 'inherit', 'right': '0'};

    if (product.critical_level == null || product.overstock_level == null) {
      return { 'left': 'calc(50% - 10px)', 'background-color' : thumbColor };
    } else if (product.on_hand < product.critical_level) {
      let criticalMargin = ((product.critical_level - product.on_hand) * 100 / (product.overstock_level - product.on_hand)).toString();
      product.criticalLevel = this.checkOverlaps(criticalMargin, product);
      product.overstockLevel = defaultRight;
      return { 'left': '-18px', 'background-color' : 'red' };
    } else if (product.on_hand === product.critical_level) {
      product.criticalLevel = defaultLeft;
      product.overstockLevel = defaultRight;
      return { 'left': '-15px', 'background-color' : 'red' };
    } else if (product.on_hand > product.overstock_level) {
      let overStockMargin = ((product.overstock_level - product.critical_level) * 100 / (product.on_hand - product.critical_level)).toString();
      product.overstockLevel = this.checkOverlaps(overStockMargin, product);
      product.criticalLevel = defaultLeft;
      return { 'right': '-15px', 'background-color' : thumbColor };
    } else {
      product.criticalLevel = defaultLeft;
      product.overstockLevel = defaultRight;
      return this.checkOverlaps(quantityMargin, product, thumbColor);
    }
  }

  private calcThumbColor(number: number) {
    let value = Math.min(Math.max(0, number), 1) * 510;
    let redValue;
    let greenValue;
    if (value < 255) {
      redValue = 255;
      greenValue = Math.sqrt(value) * 16;
      greenValue = Math.round(greenValue);
    } else {
      greenValue = 255;
      value = value - 255;
      redValue = 255 - (value * value / 255);
      redValue = Math.round(redValue);
    }
    return this.rgb2hex(redValue*.9,greenValue*.9,0);
  }

  private checkOverlaps(margin, product, thumbColor = '#fff') {
    if (Number(margin) < 12 && product.on_hand < product.critical_level) {
      return { 'left': 'calc(12% - 5px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) > 88 && product.on_hand > product.overstock_level) {
      return { 'left': 'calc(88% - 25px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) > 88 && product.on_hand !== product.overstock_level) {
      return { 'left': 'calc(88% - 18px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else if (Number(margin) < 12) {
      return { 'left': 'calc(12% - 15px)', 'background-color' : thumbColor, 'right': 'inherit' };
    } else {
      return { 'left': `calc(${margin}% - 10px)`, 'background-color' : thumbColor, 'right': 'inherit' };
    }
  }

  private rgb2hex(red, green, blue) {
    let rgb = blue | (green << 8) | (red << 16);
    return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }
}
