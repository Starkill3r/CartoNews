import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { LoadingController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public page:number = 1;
  public folder: string;
  articles: [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService, 
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public loadingController: LoadingController
    ) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.folder == "Home"){

    }else if (this.folder == "News"){
      this.getAPI();
      this.efeitoLoading();
    }else if (this.folder == "Map"){
      this.loadMap();
      this.efeitoLoading();
    }else{
      //message not fund
    }
  }

  async efeitoLoading(){
    const loading = await this.loadingController.create({
      message: "Carregando...",
      duration: 1000
    });
    await loading.present();
    const {role, data} = await loading.onDidDismiss();
  }

  efeitoRefresh(event){
    this.page = 1;
    this.getAPI();
    console.log('Iniciando operação assíncrona');

    setTimeout(() => {
      event.target.complete();
      console.log('Finalizando Refresh');
    }, 500);
  }

  getAPI(){

    this.apiService.getNews().subscribe((res)=>{
      console.log(res);
      this.articles = res['articles'];
    });
  }

  @ViewChild('map', {static: false}) mapElement: ElementRef;
  map: any;
  address: string;

  latitude: number;
  longitude: number;

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords" + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options).then((result: NativeGeocoderResult[]) => {
      this.address = "";
      let responseAddress = [];
      
      for (let [key, value] of Object.entries(result[0])) {
        if (value.length > 0)
          responseAddress.push(value);
      }

      responseAddress.reverse();
      for (let value of responseAddress) {
        this.address += value + ", ";
      }
      this.address = this.address.slice(0, -2);
    }).catch((error: any) => {
      this.address = "Address Not Available!";
    })
  }

  loadMap(){
    this.geolocation.getCurrentPosition().then((resp) =>{

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      let latLng = new google.maps.LatLng (resp.coords.latitude,resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.getAddressFromCoords(resp.coords.latitude,resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.map.addListener('dragend', () => {
        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();

        this.getAddressFromCoords(this.map.center.lat(),this.map.center.lng())
      });
    }).catch((error) => {
      console.log('Error getting location!',error);
    });
  }
}
