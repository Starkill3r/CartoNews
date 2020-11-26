import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from './user/authenticate.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public email:string="";
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/folder/Home',
      icon: 'home'
    },
    {
      title: 'News',
      url: '/folder/News',
      icon: 'newspaper'
    },
    {
      title: 'Map',
      url: '/folder/Map',
      icon: 'map'
    },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    public authenticateService: AuthenticateService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    public router: Router,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private authService: AuthenticateService
  ) {
    this.initializeApp();
  }
  
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.authService.logoutUser().then(res => {
        console.log(res);
        this.navCtrl.navigateBack('');
      }).catch(error => {
        console.log(error);
      })
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];

    this.splashScreen.show();

    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
}
