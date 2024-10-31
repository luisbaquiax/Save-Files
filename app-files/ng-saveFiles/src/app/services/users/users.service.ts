import { User } from './../../models/entidad/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url: string = 'http://localhost:3000/users/search/:username/:password';
  urlApi: string = 'http://localhost:3000/users/';
  urlUpdate: string = 'http://localhost:3000/users/update/';
  urlUserStatus: string = 'http://localhost:3000/users/users/';
  urlUsers: string = 'http://localhost:3000/users/';
  urlValidateUsers: string = 'http://localhost:3000/users/validacionUsers';

  constructor(private http: HttpClient) { }

  public searchUser(username: string, password: string): Observable<User> {
    return this.http.get<User>(this.url.replace(':username', username).replace(':password', password));
  }

  public getUsersByStatus(idUser: string): Observable<User[]>{
    return this.http.get<User[]>(this.urlUserStatus + `${idUser}`);
  }

  public createUser(user: User): Observable<User> {
    return this.http.post<User>(this.urlApi + 'create', user);
  }

  public update(user: User, password: string): Observable<any> {
    return this.http.post<any>(this.urlUpdate + `${password}`, user);
  }

  public getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.urlUsers);
  }

  public validacionUsers(): Observable<any>{
    return this.http.get<User[]>(this.urlValidateUsers);
  }
}
