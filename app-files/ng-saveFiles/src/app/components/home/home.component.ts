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
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { UsersService } from 'src/app/services/users/users.service';

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
  files: Archivo[] = [];
  archivoActual!: Archivo;

  editorForm: FormGroup;

  selectedFile: File | undefined;

  constructor(
    private session: SesionService,
    private serviceDirectory: DirectoryService,
    private serviceFile: ServiceFilesService,
    private serviceUser: UsersService,
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
    if (this.isDirectory(directory)) {
      this.serviceDirectory.getDirectoryByIdStatus(directory._id, FileState.ACTIVO).subscribe(
        (data) => {
          this.directoryActual = data;
          this.updateDirectories(directory);
        }
      );
    }
  }

  editFile(archivo: Archivo) {
    this.openEditor(archivo);
  }

  openDialgoEditFile(archivo: any) {

  }

  shareFile(idCarpeta: string) {
  }
  deleteDirectoryOrFile(idCarpeta: string) {
  }

  updateDirectories(directory: Directory) {
    this.serviceDirectory.getDirectoriesByIdParent(directory._id, FileState.ACTIVO).subscribe(
      (list) => {
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
          if (error.status === 409) {
            this.snackBar.open(`La carpeta ${carpeta.nombre} ya existe`, "Cerrar", { duration: 2000 });
          } else {
            this.snackBar.open(`Ne se pudo crear la carpeta, los sentimos`, "Cerrar", { duration: 2000 });
          }
        }
      );
    });
  }

  openEditor(archivo: Archivo | null) {
    const edicion: Editor = {
      nombre: archivo ? archivo.nombre : '',
      content: archivo ? archivo.contenido : '',
      type: archivo ? archivo.extension : Extensiones.TXT
    }

    const dialogRef = this.dialog.open(EditorComponent, { data: edicion });

    dialogRef.afterClosed().subscribe(result => {
      const editor: Editor = {
        nombre: result.nombre,
        type: result.type,
        content: result.content,
      }
      console.log(editor);
      if (editor.nombre.length == 0) {
        this.snackBar.open("El nombre de archivo no puede estar vacío", "Cerrar", { duration: 2000 });
        return;
      }

      if (archivo) {
        this.updateFile(archivo);
      } else {
        this.createFile(editor);
      }
    });

  }

  createFile(editor: Editor) {
    const nuevoArchivo: Archivo = {
      _id: '',
      id_directory: this.directoryActual._id,
      nombre: editor.nombre + editor.type,
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
      () => {
        this.updateDirectories(this.directoryActual)
        this.snackBar.open('Archivo creado correctamente', 'Cerrar')
      },
      (error) => {
        console.log(error)
        if (error.status == 409) {
          this.snackBar.open(`El archivo ${nuevoArchivo.nombre} ya existe`, 'Cerrar', { duration: 2000 });
        } else {
          this.snackBar.open('No se pudo guardar el archivo', 'Cerrar');
        }
      }
    );
  }

  updateFile(archivo: Archivo) {
    console.log('actualizando archivo ', archivo);
  }

  openDialogPassword() {
    const diagloPassword = this.dialog.open(ChangePasswordComponent, {
      data: {
        password: '',
      }
    })
    diagloPassword.afterClosed().subscribe(
      (result: User) => {
        const newPassword = result.password;
        console.log('newPassword ', newPassword);
        if (newPassword.length == 0) {
          this.snackBar.open('La nueva contraseña no puede estar vacía', 'Cerrar', { duration: 2000 });
          return;
        }
        this.serviceUser.update(this.user, newPassword).subscribe(() => {
          this.snackBar.open('La contraseña ha sido cambiado correctamente', 'Cerrar', { duration: 2000 });
        });
      }
    );
  }


  isDirectory(element: any) {
    return element.hasOwnProperty('tipo');
  }

  isFile(element: any) {
    return element.hasOwnProperty('extension');
  }

  isImage(archivo: Archivo){
    return archivo.extension == Extensiones.JPG || archivo.extension == Extensiones.PNG;
  }

  onNoClick() {
    console.log('');
  }

  uploadImage(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const descriptionFile = this.selectedFile.name.split('.');
      const fileExtension = '.' + descriptionFile[descriptionFile.length - 1];

      const archivo: Archivo = {
        _id: '',
        id_directory: this.directoryActual._id,
        nombre: this.selectedFile.name,
        ruta: this.directoryActual.ruta,
        extension: fileExtension,
        estado: FileState.ACTIVO,
        username_compartido: this.user.username,
        fecha_compartida: '',
        hora_compartida: '',
        contenido: '',
        createdAt: '',
        updatedAt: '',
      }

      if (fileExtension == Extensiones.PNG || fileExtension == Extensiones.JPG) {
        console.log('todo bien')
        const form = new FormData();
        form.append('archivo', this.selectedFile);
        form.append('archivoJson', JSON.stringify(archivo));
        this.serviceFile.sendFile(form).subscribe(
          () => {
            this.updateDirectories(this.directoryActual)
            this.snackBar.open(`Se ha guardado correctamente el archivo`, 'Cerrar', { duration: 2000 })
          },
          (error) => {
            if (error.status == 401) {
              this.snackBar.open(`El archivo ${archivo.nombre} ya existe`, 'Cerrar', { duration: 2000 })
            } else {
              console.log(error)
            }
          }
        );
      } else {
        this.snackBar.open(`Tipo de imagen ${descriptionFile[0]} no permitido`, 'Cerrar', { duration: 2000 })
      }
    } else {
      this.snackBar.open('No se seleccionó nigún archivo', 'Cerrar', { duration: 2000 })
    }
  }

  uploadImageChange(event: any, archivo: Archivo){
     console.log('cambiando imagen ', archivo)
  }


  logout() {
    this.session.cerrarSesion();
  }
}
