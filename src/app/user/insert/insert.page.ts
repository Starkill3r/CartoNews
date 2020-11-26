import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular"
import { AuthenticateService } from 'src/app/user/authenticate.service'
@Component({
  selector: 'app-insert',
  templateUrl: './insert.page.html',
  styleUrls: ['./insert.page.scss'],
})
export class InsertPage implements OnInit {

  public email:string="";
  public password:string="";
  public message:string="";
  
  constructor(
    public authenticateService: AuthenticateService,
    public router: Router,
    public toastController: ToastController,) { }

  insertUser(){
    this.authenticateService.insertFirebase(this.email, this.password).then(res => {
      this.router.navigate(['login']);
    }).catch((error) => {
      this.message = "E-mail inválido!";
      this.showMessage();
    })
  }

  redirectLogin(){
    this.router.navigate(['login']);
  }

  async showMessage(){
    const toast = await this.toastController.create({
      message: this.message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

}
