import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/entidad/User';
import { UserType } from 'src/app/models/enums/UserType';
import { UsersService } from 'src/app/services/users/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hide = true;
  hide2 = true;


  user!: User;

  form!: FormGroup;

  showMessage: boolean = false;
  message: string = '';
  messageVerification = '';
  showVerification = false;


  constructor(
    private router: Router,
    private userService: UsersService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password_confirmed: ['', Validators.required],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {

  }
  public onSubmit() {
    const username = this.form.value.username;
    const password = this.form.value.password;
    if(!this.showVerification){
      this.messageVerification = 'Las contraseñas deben ser iguales';
      this.showVerification = false;
      return;
    }

    const nuevoUsuario: User = {
      _id : '',
      username: this.form.value.username,
      password: this.form.value.password,
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      email: this.form.value.email,
      rol: UserType.EMPLEADO
    }

    this.userService.createUser(nuevoUsuario).subscribe(
      ()=>{
        this.snackBar.open('Usuario registrado correctamente', 'Cerrar', { duration: 2000 });
        this.messageVerification = '';
        this.form.reset();
      },
      (error)=>{
        console.log(error);
        if(error.status === 501){
          this.snackBar.open(`El username '${nuevoUsuario.username}' ya se encuentra en uso`, 'Cerrar', { duration: 2000 });
        }else{
          this.snackBar.open(`No se pudo crear al usuairo`, 'Cerrar', { duration: 2000 });
        }
      }
    );

  }

  public verfiricarPassword(){
    const password = this.form.value.password;
    const passwpassword_confirmedord = this.form.value.password_confirmed;
    if(password === passwpassword_confirmedord){
      this.messageVerification = 'Contraseña validado correctamente';
      this.showVerification = true;
    }else{
      this.messageVerification = 'Las contraseñas deben ser iguales';
      this.showVerification = false;
    }
  }
}
