import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Archivo } from 'src/app/models/entidad/Archivo';

@Injectable({
  providedIn: 'root'
})
export class ServiceFilesService {

private urlCreate: string = 'http://localhost:3000/files/create';
private urlList: string = 'http://localhost:3000/files/list';
private urlSendFile: string = 'http://localhost:3000/files/send-image';
private urlUpdateFile: string = 'http://localhost:3000/files/updateFile';
private urlCreateShared: string = 'http://localhost:3000/files/shared';
private urlFilesShareds: string = 'http://localhost:3000/files/get-shareds';
private urlUpdateImage: string = 'http://localhost:3000/files/updateImage';

constructor(private http: HttpClient) { }

public create(file: Archivo): Observable<any> {
  return this.http.post<any>(this.urlCreate, file)
}

public createShared(shared: Archivo, tipoArchivo: string): Observable<any> {
  return this.http.post<any>(this.urlCreateShared + `/${tipoArchivo}`, shared);
}
public filesByDirectory(id_directory: string, estado: string): Observable<Archivo[]>{
  return this.http.get<Archivo[]>(this.urlList + `/${id_directory}/${estado}`);
}
public sendFile(form: FormData): Observable<any>{
  return this.http.post<any>(this.urlSendFile, form);
}
public updateFile(archivo: Archivo): Observable<any>{
  return this.http.put<any>(this.urlUpdateFile, archivo);
}

public updateImage(form: FormData): Observable<any> {
  return this.http.put<any>(this.urlUpdateImage, form);
}

public filesShareds(username: string): Observable<Archivo[]>{
  return this.http.get<Archivo[]>(this.urlFilesShareds + `/${username}`)
}

}
