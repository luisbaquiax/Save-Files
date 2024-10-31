import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Archivo } from 'src/app/models/entidad/Archivo';
import { Directory } from 'src/app/models/entidad/Directory';
import { User } from 'src/app/models/entidad/User';
import { Extensiones } from 'src/app/models/enums/Extensiones';
import { FileState } from 'src/app/models/enums/FileState';
import { FileType } from 'src/app/models/enums/FileType';
import { getDefaultContentFile, getNameFile } from 'src/app/models/Utiles';
import { DirectoryService } from 'src/app/services/serviceDirectories/directory.service';
import { ServiceFilesService } from 'src/app/services/serviceFiles/serviceFiles.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UsersService } from 'src/app/services/users/users.service';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { Editor } from 'src/app/models/entidad/Editor';
import { EditorComponent } from '../editor/editor.component';
import { DirectoryType } from 'src/app/models/enums/DirectoryType';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {

  nameProject: string = 'GraFiles';

  displayedColumns: string[] = ['Nombre', 'Propietario', 'Fecha', 'Tipo', 'actions'];

  displayedColumnsUsers: string[] = ['Nombre', 'Apellido', 'Correo', 'Rol', 'Username', 'actions'];

  isExpanded = true;

  user: User;
  directoryRoot!: Directory;
  directoryActual!: Directory;

  dataSource: any[] = [];
  dataSourceUsers: any[] = [];

  directories: Directory[] = [];
  files: Archivo[] = [];
  archivoActual!: Archivo;
  users: User[] = [];

  editorForm: FormGroup;

  showHome: boolean = true;
  showShareds: boolean = false;
  showPaste: boolean = false;
  elementCopy!: any;
  parameter: number = 0;

  showFomrUser: boolean = false;
  showTrash: boolean = true;
  showUsers: boolean = false;
  title: string = '';

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

    this.setFilesDeleteds();
    this.setUsers();
  }


  ngOnInit() {
    this.session.validarSesion();
    this.setFilesDeleteds();
    this.setUsers();
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  setUsers(){
    this.serviceUser.getUsers().subscribe(
      (data) => {
        this.users = data;
        this.dataSourceUsers = this.users;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewUsers(){
    this.showUsers = true;
    this.showFomrUser = false;
    this.showTrash = false;
    this.title = 'Usuarios'
  }

  setFilesDeleteds() {
    this.serviceFile.filesDeleteds().subscribe(
      (list) => {
        this.files = list;
        this.dataSource = list;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showFormRegister() {
    this.showFomrUser = true;
    this.showTrash = false;
    this.showUsers = false;
  }

  createUser() {
    this.showFomrUser = true;
    this.showTrash = false;
    this.showUsers = false;
  }

  deleteds() {
    this.showFomrUser = false;
    this.showUsers = false;
    this.showTrash = true;
    this.title = 'Archivos eliminados';
  }

  setUsersByStatus() {
    this.serviceUser.getUsersByStatus(this.user._id).subscribe((users) => {
      this.users = users;
    })
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

  viewFile(archivo: Archivo) {
    if (this.isImage(archivo)) {

    } else {
      this.openEditor(archivo);
    }
  }

  copyElement(element: any) {
    this.showPaste = true;
    this.elementCopy = JSON.parse(JSON.stringify(element));
    this.parameter = 1;
  }

  moveElement(element: any) {
    this.showPaste = true;
    this.elementCopy = JSON.parse(JSON.stringify(element));
    this.parameter = 2;
  }

  pasteELement() {
    if (this.parameter == 1) {
      this.executeCopyElement();
    } else {
      this.excuteMoveElement();
    }
    this.parameter = 0;
  }

  excuteMoveElement() {
    if (this.directoryActual._id == this.elementCopy.id_directory) {
      this.snackBar.open('Debes elegir otra carpta para mover', 'Cerrar', { duration: 2000 })
    } else {

      this.elementCopy.nombre = 'mv-' + this.elementCopy.nombre;
      this.elementCopy.id_directory = this.directoryActual._id;

      if (this.isImage(this.elementCopy) || this.isFile(this.elementCopy)) {
        this.serviceFile.updateFile(this.elementCopy).subscribe(() => {
          this.updateDirectories(this.directoryActual);
          this.snackBar.open('Archivo movido con éxito.', 'Cerrar', { duration: 2000 });
        },
          (error) => {
            this.snackBar.open('No se pudo mover el archivo.', 'Cerrar', { duration: 2000 });
          }
        );
      } else if (this.isDirectory(this.elementCopy)) {
        this.serviceDirectory.update(this.elementCopy).subscribe(
          () => {
            this.updateDirectories(this.directoryActual);
            this.snackBar.open('Carpeta movido con éxito.', 'Cerrar', { duration: 2000 });
          },
          (error) => {
            this.snackBar.open('No se pudo mover la carpeta.', 'Cerrar', { duration: 2000 });
          }
        );
      }
      this.showPaste = false;
    }

  }

  executeCopyElement() {
    this.elementCopy.nombre = 'copia-' + this.elementCopy.nombre;
    this.elementCopy.id_directory = this.directoryActual._id;
    console.log('copiar elemento ', this.elementCopy);
    if (this.isImage(this.elementCopy)) {

    } else if (this.isDirectory(this.elementCopy)) {
      //directorio
      this.serviceDirectory.create(this.elementCopy.nombre, this.elementCopy.id_directory, this.elementCopy).subscribe(
        (data) => {
          this.updateDirectories(this.directoryActual);
          this.snackBar.open('Carpeta creada correctamente', 'Cerrar');
        },
        (error) => {
          console.log(error)
          if (error.status == 409) {
            this.snackBar.open(`La carpeta ${this.elementCopy.nombre} ya existe`, 'Cerrar', { duration: 2000 });
          } else {
            this.snackBar.open('No se pudo guardar la carpeta', 'Cerrar');
          }
        }
      );
    } else {
      //archivo de texto
      this.serviceFile.create(this.elementCopy).subscribe(
        () => {
          this.updateDirectories(this.directoryActual);
          this.snackBar.open('Archivo creado correctamente', 'Cerrar');
        },
        (error) => {
          console.log(error)
          if (error.status == 409) {
            this.snackBar.open(`El archivo ${this.elementCopy.nombre} ya existe`, 'Cerrar', { duration: 2000 });
          } else {
            this.snackBar.open('No se pudo guardar el archivo', 'Cerrar');
          }
        }
      );
    }
    this.showPaste = false;
  }

  updateDirectories(directoryActual: Directory) {
    this.serviceDirectory.getDirectoriesByIdParent(directoryActual._id, FileState.ACTIVO).subscribe(
      (list) => {
        this.directories = list;
        this.updateFileByDirectory(directoryActual, FileState.ACTIVO);
      },
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

  openEditor(archivo: Archivo) {
    const edicion: Editor = {
      nombre: getNameFile(archivo.nombre),
      content: archivo.contenido,
      type: archivo.extension
    }
    const dialogRef = this.dialog.open(EditorComponent, { data: edicion });

    dialogRef.afterClosed().subscribe(result => {
    });

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

  isImage(archivo: Archivo) {
    return archivo.extension == Extensiones.JPG
      || archivo.extension == Extensiones.PNG
      || archivo.extension == '.PNG'
      || archivo.extension == '.JPG';
  }

  onNoClick() {
    console.log('');
  }

  logout() {
    this.session.cerrarSesion();
  }

}
