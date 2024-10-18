import { User } from './../../models/entidad/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url: string = 'http://localhost:3000/users/search/:username/:password'
  urlApi: string = 'http://localhost:3000/users/'

  constructor(private http: HttpClient) { }

  public searchUser(username: string, password: string): Observable<User> {
    return this.http.get<User>(this.url.replace(':username', username).replace(':password', password));
  }

  public createUser(user: User): Observable<User> {
    return this.http.post<User>(this.urlApi + 'create', user);
  }
}
