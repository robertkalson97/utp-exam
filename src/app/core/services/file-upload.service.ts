import { Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';

import { ExifService } from './exif.service';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { AttachmentUploadModel } from '../../dashboard/shopping-list/orders-preview/purchase-order/edit-email-data-modal/edit-email-data-modal.component';


@Injectable()
export class FileUploadService {
  constructor(
    public exifService: ExifService,
    public restangular: Restangular
  ) {
  }
  
  getOrientedImage(file) {
    let orientationNumber = this.getOrientation(file);
    
    return this.getOrientedImageByOrientation(file, orientationNumber);
  }
  
  getOrientedImageByOrientation(file, orientationNumber) {
    let img: any;
    let image = this.getImageFromBase64(file);
    
    if ([3, 6, 8].indexOf(orientationNumber) > -1) {
      let canvas: HTMLCanvasElement = document.createElement("canvas"),
        ctx: CanvasRenderingContext2D = canvas.getContext("2d"),
        cw: number = image.width,
        ch: number = image.height,
        cx: number = 0,
        cy: number = 0,
        deg: number = 0;
      
      switch (orientationNumber) {
        case 3:
          cx = -image.width;
          cy = -image.height;
          deg = 180;
          break;
        case 6:
          cw = image.height;
          ch = image.width;
          cy = -image.height;
          deg = 90;
          break;
        case 8:
          cw = image.height;
          ch = image.width;
          cx = -image.width;
          deg = 270;
          break;
        default:
          break;
      }
      
      canvas.width = cw;
      canvas.height = ch;
      ctx.rotate(deg * Math.PI / 180);
      ctx.drawImage(image, cx, cy);
      return canvas.toDataURL("image/png");
    } else {
      return image.src;
    }
  }
  
  getOrientation(file) {
    let buffer = this.exifService.base64ToArrayBuffer(file);
    let orientationNum = this.getOrientationFromBase64(buffer);
    return orientationNum;
  }
  
  getOrientationFromBase64(file) {
    return this.exifService.findEXIFinJPEG(file) ? this.exifService.findEXIFinJPEG(file)['Orientation'] : null;
  }
  
  getImageFromBase64(file) {
    let exif = this.exifService.findEXIFinJPEG(this.exifService.base64ToArrayBuffer(file));
    let image = new Image();
    image.src = file;
    if (exif) {
      image.width = exif.PixelXDimension;
      image.height = exif.PixelYDimension;
    }
    
    return image;
  }
  
  
  getResizeArea() {
    let resizeArea = document.getElementById('imageupload-resize-area');
    if (!resizeArea) {
      resizeArea = document.createElement('canvas');
      resizeArea.id = 'imageupload-resize-area';
      resizeArea.style.visibility = 'hidden';
      resizeArea.style.position = 'absolute';
      resizeArea.style.transform = 'translate(-2000px, 0)';
      document.body.appendChild(resizeArea);
    }
    
    return <HTMLCanvasElement>resizeArea;
  }
  
  resizeImage(
    origImage,
    {
      resizeMaxHeight = 500,
      resizeMaxWidth = 500,
      resizeQuality = 1.0,
      resizeType = 'image/jpeg'
    } = {}
  ) {
    let canvas = this.getResizeArea();
    
    let height = origImage.height;
    let width = origImage.width;
    
    resizeMaxHeight = resizeMaxHeight || resizeMaxWidth;
    resizeMaxWidth = resizeMaxWidth || resizeMaxHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    
    let ctx = canvas.getContext("2d");
    ctx.drawImage(origImage, 0, 0);
    this.resample_single(canvas, resizeMaxWidth, resizeMaxHeight);
    
    // get the data from canvas as 70% jpg (or specified type).
    return canvas.toDataURL(resizeType, resizeQuality);
  }
  
  resample_single(canvas, width, height, resize_canvas = true) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);
    
    // calculate the width and height, constraining the proportions
    if (width_source > height_source) {
      height = Math.round(height_source * width / width_source);
    } else {
      width = Math.round(width_source * height / height_source);
    }
    
    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);
    
    var ctx = canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;
    
    for (var j = 0; j < height; j++) {
      for (var i = 0; i < width; i++) {
        var x2 = (i + j * width) * 4;
        var weight = 0;
        var weights = 0;
        var weights_alpha = 0;
        var gx_r = 0;
        var gx_g = 0;
        var gx_b = 0;
        var gx_a = 0;
        var center_y = (j + 0.5) * ratio_h;
        var yy_start = Math.floor(j * ratio_h);
        var yy_stop = Math.ceil((j + 1) * ratio_h);
        for (var yy = yy_start; yy < yy_stop; yy++) {
          var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
          var center_x = (i + 0.5) * ratio_w;
          var w0 = dy * dy; //pre-calc part of w
          var xx_start = Math.floor(i * ratio_w);
          var xx_stop = Math.ceil((i + 1) * ratio_w);
          for (var xx = xx_start; xx < xx_stop; xx++) {
            var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
            var w = Math.sqrt(w0 + dx * dx);
            if (w >= 1) {
              //pixel too far
              continue;
            }
            //hermite filter
            weight = 2 * w * w * w - 3 * w * w + 1;
            var pos_x = 4 * (xx + yy * width_source);
            //alpha
            gx_a += weight * data[pos_x + 3];
            weights_alpha += weight;
            //colors
            if (data[pos_x + 3] < 255)
              weight = weight * data[pos_x + 3] / 250;
            gx_r += weight * data[pos_x];
            gx_g += weight * data[pos_x + 1];
            gx_b += weight * data[pos_x + 2];
            weights += weight;
          }
        }
        data2[x2] = gx_r / weights;
        data2[x2 + 1] = gx_g / weights;
        data2[x2 + 2] = gx_b / weights;
        data2[x2 + 3] = gx_a / weights_alpha;
      }
    }
    //clear and resize canvas
    if (resize_canvas === true) {
      canvas.width = width;
      canvas.height = height;
    } else {
      ctx.clearRect(0, 0, width_source, height_source);
    }
    
    //draw
    ctx.putImageData(img2, 0, 0);
  }
  
  // file upload universal  endpoint
  uploadDocuments(account_id: string, type: string, id: string, documents: any) {
    if (_.isEmpty(documents)) {
      return Observable.of({'continue': 'no docs to upload'});
    }
    if (!account_id || !type || !id) {
      return Observable.of({'error': 'not enough input data'});
    }
    
    let formData: FormData = new FormData();
    formData.append('id', id);
    formData.append('type', type);
    let i = 0;
    _.each(documents, (value, key) => {
      formData.append('documents[' + i + ']', documents[i]);
      i++;
    });
    return this.restangular
    .one('accounts', account_id)
    .one('upload')
    .customPOST(formData, undefined, undefined, {'Content-Type': undefined});
    
  }
  
  uploadAttachment(order_id: string, document: File) {
    if (!document) {
      return Observable.of({'continue': 'no docs to upload'});
    }
    let formData: FormData = new FormData();
    formData.append('attachment', document);
    return this.restangular
    .one('po', order_id)
    .one('attachment')
    .customPOST(formData, undefined, undefined, {'Content-Type': undefined});
    
  }
  deleteAttachment(order_id: string, attach: AttachmentUploadModel){
    // DELETE /po/{order_id}/attachment/{attachment_id}
    let e$ = this.restangular
    .one('po', order_id)
    .one('attachment', attach.id)
    .customDELETE();
    return e$.filter(e=>(e && e.data)).map(e=>e.data);
  }
}
