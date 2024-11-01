import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/entidad/User';
import { UserType } from 'src/app/models/enums/UserType';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;

  user!: User;
  users: User[] = [];

  form!: FormGroup;

  showMessage: boolean = false;
  message: string = '';



  constructor(private router: Router, private userService: UsersService, private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.validateUsers();
  }

  ngOnInit(): void {
    this.validateUsers();
  }

  validateUsers(){
    this.userService.validacionUsers().subscribe((data)=>{ console.log('hecho')});
  }

  public onSubmit() {
    const username = this.form.value.username;
    const password = this.form.value.password;
    this.userService.searchUser(username, password).subscribe((data) => {
      this.user = data;
      localStorage.setItem('userLogin', JSON.stringify(this.user));
      if(this.user.rol === UserType.EMPLEADO){
        this.router.navigate(['home']);
      }else{
        this.router.navigate(['home-admin']);
      }
    }, (error) => {
      this.showMessage = true;
      if (error.status == 404) {
        this.message = 'Usted no se encuentra registrado!'
      } else if (error.status == 401) {
        this.message = 'Contraseña incorrecta, vuelva a intentar de nuevo!'
      }
    }
    );
  }
}
