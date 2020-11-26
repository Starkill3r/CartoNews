import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticateService } from '../authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public email:string="";
  public password:string="";
  public message:string="";

  constructor(
    public authenticateService: AuthenticateService,
    public router: Router,
    public toastController: ToastController,  
  ) { }

  loginUser(){
    this.authenticateService.loginFirebase(this.email, this.password).then(res => {
      this.router.navigate(['folder/Home']);
    }).catch((error) => {
      this.message = "E-mail e/ou Senha incorreto(s)!";
      this.showMessage();
    })
  }

  redirectInsert(){
    //Button for redirect to signup page
    this.router.navigate(['insert']);
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
