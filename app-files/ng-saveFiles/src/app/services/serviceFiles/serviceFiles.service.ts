import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Archivo } from 'src/app/models/entidad/Archivo';

@Injectable({
  providedIn: 'root'
})
export class ServiceFilesService {

urlCreate: string = 'http://localhost:3000/files/create';
urlList: string = 'http://localhost:3000/files/list';
urlSendFile: string = 'http://localhost:3000/files/send-image';

constructor(private http: HttpClient) { }

public create(file: Archivo): Observable<any> {
  return this.http.post<any>(this.urlCreate, file)
}

public filesByDirectory(id_directory: string, estado: string): Observable<Archivo[]>{
  return this.http.get<Archivo[]>(this.urlList + `/${id_directory}/${estado}`);
}

public sendFile(form: FormData): Observable<any>{
  return this.http.post<any>(this.urlSendFile, form);
}

}
