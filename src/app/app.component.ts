import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from './core/services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    public activatedRoute: ActivatedRoute,
    public userService: UserService
  ) {}

  ngOnInit(){
    this.userService.selfData$
    .filter((sD)=>(sD && sD.user_echo_token && !window['_ues']))
    .take(1)
    .subscribe((selfData:any)=>{
      // userecho service config

      window['_ues'] = {
        host: 'kirawoods.userecho.com',
        forum: '1',
        lang: 'en',
        tab_corner_radius: 5,
        tab_font_size: 20,
        tab_image_hash: 'ZmVlZGJhY2s%3D',
        tab_chat_hash: 'Y2hhdA%3D%3D',
        tab_alignment: 'top',
        tab_text_color: '#ffffff',
        tab_text_shadow_color: '#00000055',
        tab_bg_color: '#57a957',
        tab_hover_color: '#f45c5c',
        params: {sso_token:selfData.user_echo_token}
      };
      console.log("USERECHO init data", window['_ues']);
      // userecho service
      let node = document.createElement('script');
      node.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.userecho.com/js/widget-1.4.gz.js';
      node.type = 'text/javascript';
      node.async = true;
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
    });
  }
}
