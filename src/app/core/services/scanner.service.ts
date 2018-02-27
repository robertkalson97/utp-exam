import {Injectable, NgZone, ViewChild, Input,} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ScannerService {
  selectedFile$: Subject<File> = new Subject();
  subscribers: any = {};
  videoStreamUrl: string;
  navigator: any = navigator;
  window: any = window;
  canvas;
  video;
  modal;
  constructor(
      private ngZone: NgZone,
  ) {}
    onChangeFile(file) {
        if (file.target.files.length) {
            this.selectedFile$.next(file.target.files[0]);
        }
    }

    captureMe() {
        const canvas: HTMLCanvasElement = this.canvas.nativeElement;
        const video: HTMLVideoElement = this.video.nativeElement;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        if (!this.videoStreamUrl) return;
        // переворачиваем canvas зеркально по горизонтали (см. описание внизу статьи)
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        // отрисовываем на канвасе текущий кадр видео
        context.drawImage(video, 0, 0, video.width, video.height);
        // получаем data: url изображения c canvas
        let base64dataUrl = canvas.toDataURL('image/png');

        let file = this.dataURLtoFile(base64dataUrl, 'img');

        this.ngZone.run(() => {
            this.selectedFile$.next(file);
        });
    };

    dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    }

    onStopStrem() {
        this.subscribers.qwe.unsubscribe();
        this.videoStreamUrl = '';
        this.video.nativeElement.src = this.videoStreamUrl;
        this.modal.dismiss();
    }

    onStartStream(video, canvas, modal) {
      this.video = video;
      this.canvas = canvas;
      this.modal = modal;
      this.navigator.getUserMedia = this.navigator.getUserMedia || this.navigator.webkitGetUserMedia || this.navigator.mozGetUserMedia || this.navigator.msGetUserMedia;
      this.window.URL.createObjectURL = this.window.URL.createObjectURL || this.window.URL.webkitCreateObjectURL || this.window.URL.mozCreateObjectURL || this.window.URL.msCreateObjectURL;
        // запрашиваем разрешение на доступ к поточному видео камеры
        this.navigator.getUserMedia({video: true}, (stream) => {

            this.ngZone.run(() => {
                this.videoStreamUrl = this.window.URL.createObjectURL(stream);
                this.video.nativeElement.src = this.videoStreamUrl;

                this.subscribers.qwe = Observable.interval(300)
                    .subscribe(() => {
                        this.captureMe();
                    });

            });
        }, function () {
            console.log('что-то не так с видеостримом или пользователь запретил его использовать :P');
        });
    }

}