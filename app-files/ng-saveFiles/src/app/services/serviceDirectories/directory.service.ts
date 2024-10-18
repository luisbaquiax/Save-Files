import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Directory } from 'src/app/models/entidad/Directory';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  urlRoot: string = 'http://localhost:3000/directories/getRoot/';

  constructor(private http: HttpClient) { }

  public getRoot(username: string): Observable<Directory>{
    return this.http.get<Directory>(this.urlRoot + username)
  }

}
