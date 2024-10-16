import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  constructor(private router: Router) { }

  public validarSesion() {
    let user = localStorage.getItem('userLogin');
    if(user == null){
      this.router.navigate(['/login']);
    }else{

    }
  }

  public cerrarSesion() {
    localStorage.removeItem('userLogin');
    this.router.navigate(['/login']);
  }
}
