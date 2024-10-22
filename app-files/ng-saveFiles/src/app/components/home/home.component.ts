import { Component, OnInit } from '@angular/core';
import { Directory } from 'src/app/models/entidad/Directory';
import { User } from 'src/app/models/entidad/User';
import { DirectoryType } from 'src/app/models/enums/DirectoryType';
import { FileState } from 'src/app/models/enums/FileState';
import { DirectoryService } from 'src/app/services/serviceDirectories/directory.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { MatDialog } from '@angular/material/dialog';
import { HomeDialogDirectoryComponent } from '../home-dialog-directory/home-dialog-directory.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditorComponent } from '../editor/editor.component';
import { Editor } from 'src/app/models/entidad/Editor';
import { Extensiones } from 'src/app/models/enums/Extensiones';
import { Archivo } from 'src/app/models/entidad/Archivo';
import { ServiceFilesService } from 'src/app/services/serviceFiles/serviceFiles.service';
import { Dir } from '@angular/cdk/bidi';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['Nombre', 'Propietario', 'Fecha', 'Tipo', 'actions'];

  isExpanded = true;

  user: User;
  directoryRoot!: Directory;
  directoryActual!: Directory;

  dataSource: any[] = [];
  directories: Directory[] = [];
  files: Archivo [] = [];

  editorForm: FormGroup;

  selectedFile: File | undefined;

  constructor(
    private session: SesionService,
    private serviceDirectory: DirectoryService,
    private serviceFile: ServiceFilesService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {

    let useJson = localStorage.getItem('userLogin');
    this.user = useJson ? JSON.parse(useJson) : null;

    this.editorForm = this.fb.group({
      content: ['']
    });

    this.setDirectoryRoot();
  }

  ngOnInit() {
    this.session.validarSesion();
    this.setDirectoryRoot();
  }

  setDirectoryRoot() {
    this.serviceDirectory.getRoot(this.user.username).subscribe((data) => {
      this.directoryRoot = data;
      this.directoryActual = data;
      this.serviceDirectory.getDirectoriesByIdParent(this.directoryActual._id, FileState.ACTIVO).subscribe(
        (list) => {
          this.directories = list;
          this.updateFileByDirectory(this.directoryActual, FileState.ACTIVO);
        }
      );
    });
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  action1(directory: Directory | any) {
    if(this.isDirectory(directory)){
      this.serviceDirectory.getDirectoryByIdStatus(directory._id, FileState.ACTIVO).subscribe(
        (data)=>{
          this.directoryActual = data;
          this.updateDirectories(directory);
        }
      );
    }
  }

  shareDirectory(idCarpeta: string) {
    console.log('position ', idCarpeta);
  }
  deleteDirectory(idCarpeta: string) {
    console.log('position ', idCarpeta);
  }

  openDialog() {
    const dialogRef = this.dialog.open(HomeDialogDirectoryComponent, {
      data: {
        _id: '',
        username: '',
        id_directory: '',
        nombre: '',
        ruta: '',
        estado: '',
        username_compartido: '',
        tipo: '',
        updatedAt: '',
        createdAt: ''
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const carpeta: Directory = {
        _id: '',
        username: this.user.username,
        id_directory: this.directoryActual._id,
        nombre: result.nombre,
        ruta: '',
        estado: FileState.ACTIVO,
        username_compartido: this.user.username,
        tipo: DirectoryType.NORMAL,
        updatedAt: '',
        createdAt: ''
      }

      this.serviceDirectory.create(result.nombre, this.directoryActual._id, carpeta).subscribe(
        (data) => {
          this.updateDirectories(this.directoryActual);
          this.snackBar.open("Carpeta creado con éxito", "Cerrar", { duration: 2000 });
        },
        (error) => {
          console.log(error);
          if(error.status === 409){
            this.snackBar.open(`La carpeta ${carpeta.nombre} ya existe`, "Cerrar", { duration: 2000 });
          }else{
            this.snackBar.open(`Ne se pudo crear la carpeta, los sentimos`, "Cerrar", { duration: 2000 });
          }
        }
      );
    });
  }

  updateDirectories(directory: Directory){
    this.serviceDirectory.getDirectoriesByIdParent(directory._id, FileState.ACTIVO).subscribe(
      (list)=>{
        this.directories = list;
        this.updateFileByDirectory(directory, FileState.ACTIVO);
      }
    );
  }

  updateFileByDirectory(directory: Directory, estado: string) {
    this.serviceFile.filesByDirectory(directory._id, estado).subscribe(
      (data) => {
        this.files = data;
        this.dataSource = [...this.directories, ...this.files];
      },
      (error) => {
        console.log(error);
      }
    );
  }

  openEditor(){
    const dialogRef = this.dialog.open(EditorComponent, {
      data: {
        nombre: '',
        content: '',
        type: Extensiones.TXT,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      const editor: Editor = {
        nombre: result.nombre,
        type: result.type,
        content: result.content,
      }
      console.log(editor);
      if(editor.nombre.length == 0){
        this.snackBar.open("El nombre de archivo no puede estar vacío", "Cerrar", { duration: 2000 });
        return;
      }
      const nuevoArchivo: Archivo = {
        _id: '',
        id_directory: this.directoryActual._id,
        nombre: editor.nombre,
        ruta: '',
        extension: editor.type,
        estado: FileState.ACTIVO,
        username_compartido: '',
        fecha_compartida: '',
        hora_compartida: '',
        contenido: editor.content,
        createdAt: '',
        updatedAt: '',
      }

      this.serviceFile.create(nuevoArchivo).subscribe(
        ()=>{
          this.updateDirectories(this.directoryActual)
          this.snackBar.open('Archivo creado correctamente', 'Cerrar')
        },
        (error)=>{
          console.log(error)
          this.snackBar.open('No se pudo guardar el archivo', 'Cerrar')
        }
      );
    });
  }

  isDirectory(element: any){
    return element.hasOwnProperty('tipo');
  }

  isFile(element: any){
    return element.hasOwnProperty('extension');
  }

  onNoClick() {
    console.log('');
  }

  uploadImage(event: any){
    this.selectedFile = event.target.files[0];
    if(this.selectedFile){
      const descriptionFile = this.selectedFile.name.split('.');
      console.log('nombre ' , descriptionFile[0]);
      console.log('extension ',descriptionFile[1]);
    }else{
      this.snackBar.open('No se seleccionó nigún archivo', 'Cerrar', { duration: 2000 })
    }
  }

  logout() {
    this.session.cerrarSesion();
  }
}
