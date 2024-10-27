import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Directory } from 'src/app/models/entidad/Directory';
import { Message } from 'src/app/models/entidad/Message';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  urlRoot: string = 'http://localhost:3000/directories/getRoot/';
  urlList: string = 'http://localhost:3000/directories/list/';
  urlCarpeta: string = 'http://localhost:3000/directories/carpeta/';
  urlCreate: string =  'http://localhost:3000/directories/createDirectory/';
  urlUpdate: string = 'http://localhost:3000/directories/update';

  constructor(private http: HttpClient) { }

  public getRoot(username: string): Observable<Directory> {
    return this.http.get<Directory>(this.urlRoot + username)
  }

  public getDirectoriesByIdParent(idParent: string, estado: string): Observable<Directory[]> {
    return this.http.get<Directory[]>(this.urlList + `${idParent}/${estado}`);
  }

  public getDirectoryByIdStatus(id: string, estado: string): Observable<Directory>{
    return this.http.get<Directory>(this.urlCarpeta + `${id}/${estado}`);
  }

  public create(nombre: string, idParent: string, carpeta: Directory): Observable<Directory> {
    return this.http.post<Directory>(this.urlCreate + `${nombre}/${idParent}`, carpeta);
  }

  public update(direcory: Directory): Observable<any> {
    return this.http.put<any>(this.urlUpdate, { carpeta: direcory });
  }

}
