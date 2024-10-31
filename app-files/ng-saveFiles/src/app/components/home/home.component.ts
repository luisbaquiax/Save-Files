import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Directory } from 'src/app/models/entidad/Directory';
import { User } from 'src/app/models/entidad/User';
import { DirectoryType } from 'src/app/models/enums/DirectoryType';
import { FileState } from 'src/app/models/enums/FileState';
import { DirectoryService } from 'src/app/services/serviceDirectories/directory.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { Editor } from 'src/app/models/entidad/Editor';
import { Extensiones } from 'src/app/models/enums/Extensiones';
import { Archivo } from 'src/app/models/entidad/Archivo';
import { ServiceFilesService } from 'src/app/services/serviceFiles/serviceFiles.service';
import { UsersService } from 'src/app/services/users/users.service';
import { getNameFile, getDefaultContentFile } from 'src/app/models/Utiles';
import { FileType } from 'src/app/models/enums/FileType';
//material angular
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
//components
import { EditorComponent } from '../editor/editor.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { HomeDialogDirectoryComponent } from '../home-dialog-directory/home-dialog-directory.component';
import { UsersListComponent } from './../UsersList/UsersList.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  nameProject: string = 'GraFiles';

  displayedColumns: string[] = ['Nombre', 'Propietario', 'Fecha', 'Tipo', 'actions'];

  isExpanded = true;

  user: User;
  directoryRoot!: Directory;
  directoryActual!: Directory;

  dataSource: any[] = [];
  directories: Directory[] = [];
  files: Archivo[] = [];
  filesShareds: Archivo[] = [];
  archivoActual!: Archivo;
  users: User[] = [];

  editorForm: FormGroup;

  showHome: boolean = true;
  showShareds: boolean = false;
  showPaste: boolean = false;
  elementCopy!: any;
  parameter: number = 0;

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
    this.showHome = true;
    this.showShareds = false;
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

  setUsersByStatus() {
    this.serviceUser.getUsersByStatus(this.user._id).subscribe((users) => {
      this.users = users;
    })
  }

  setShareds() {
    this.showHome = false;
    this.showShareds = true;
    this.serviceFile.filesShareds(this.user.username).subscribe(
      (data) => {
        this.filesShareds = data;
        this.dataSource = data;
      }
    );
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
  shareFile(element: Archivo) {
    const dialogRef = this.dialog.open(UsersListComponent, {
      width: '350px',
      data: {
        username: String
      }
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {

        element.username_compartido = result;
        if (element.username_compartido.length == 0) {
          this.snackBar.open('Debe seleccionar un usuario', 'Cerrar', { duration: 2000 });
          return;
        }
        element.tipo_archivo = FileState.COMPARTIDO;
        let archivoTipo = FileType.TXT;
        if (this.isImage(element)) {
          archivoTipo = FileType.IMG;
          console.log('es imagen');
        }
        this.serviceFile.createShared(element, archivoTipo).subscribe(
          (data) => {
            this.snackBar.open('Se ha compartido exitosamente el archivo', 'Cerrar', { duration: 2000 });
          },
          (error) => {
            console.log(error);
            this.snackBar.open('No se pudo compartir el archivo', 'Cerrar', { duration: 2000 });
          }
        );
      }
    });
  }
  deleteDirectoryOrFile(element: any) {
    element.estado = FileState.ELIMINADO;
    if (this.isDirectory(element)) {
      this.updateDirectory(element, 'Carpeta eliminado correctamente');
    } else {
      this.updateFile(element, 'Se ha eliminado correctamente el archivo');
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
      nombre: archivo ? getNameFile(archivo.nombre) : '',
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
        archivo.nombre = editor.nombre + editor.type;
        archivo.contenido = editor.content;
        archivo.extension = editor.type;
        this.updateFile(archivo, 'Se ha actualizado correctamente el archivo');
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
      propietario: this.user.username,
      tipo_archivo: FileType.NORMAL,
      contenido: editor.content,
      createdAt: '',
      updatedAt: '',
    }
    if (nuevoArchivo.contenido.length == 0) {
      nuevoArchivo.contenido = ' ';
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

  updateFile(archivo: Archivo, message: string) {
    this.serviceFile.updateFile(archivo).subscribe(() => {
      this.snackBar.open('Se ha actualizado correctamente el acrhivo.', 'Cerrar', { duration: 2000 });
      if (this.showShareds) {
        this.setShareds();
      } else {
        this.updateDirectories(this.directoryActual);
      }
    },
      (error) => {
        console.log(error)
        if (error.status == 404) {
          this.snackBar.open(message, 'Cerrar', { duration: 2000 });
        } else if (error.status == 409) {
          this.snackBar.open(`El archivo ${archivo.nombre} ya existe`, 'Cerrar', { duration: 2000 });
        } else {
          this.snackBar.open('No se pudo actualizar el archivo', 'Cerrar');
        }
      }
    );
  }

  updateDirectory(element: Directory, message: string) {
    this.serviceDirectory.update(element).subscribe(() => {
      this.updateDirectories(this.directoryActual);
      this.snackBar.open(message, 'Cerrar', { duration: 2000 })
    },
      (error) => {
        this.snackBar.open('No se pudo realizar la accion', 'Cerrar', { duration: 2000 })
      }
    );
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
        username_compartido: ' ',
        propietario: this.user.username,
        tipo_archivo: FileType.NORMAL,
        contenido: getDefaultContentFile(),
        createdAt: '',
        updatedAt: '',
      }

      if (this.isImage(archivo)) {
        const form = new FormData();
        form.append('archivo', this.selectedFile);
        form.append('archivoJson', JSON.stringify(archivo));
        this.serviceFile.sendFile(form).subscribe(
          () => {
            this.updateDirectories(this.directoryActual);
            this.snackBar.open(`Se ha guardado correctamente el archivo`, 'Cerrar', { duration: 2000 })
          },
          (error) => {
            if (error.status == 401) {
              this.snackBar.open(`El archivo ${archivo.nombre} ya existe`, 'Cerrar', { duration: 2000 })
            } else {
              console.log(error)
              this.snackBar.open(`No se pudo guardar la imagen`, 'Cerrar', { duration: 2000 })
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

  uploadImageChange(event: any, element: Archivo) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {

      const descriptionFile = this.selectedFile.name.split('.');
      const fileExtension = '.' + descriptionFile[descriptionFile.length - 1];

      const archivo: Archivo = {
        _id: element._id,
        id_directory: element.id_directory,
        nombre: this.selectedFile.name,
        ruta: this.directoryActual.ruta,
        extension: fileExtension,
        estado: FileState.ACTIVO,
        username_compartido: ' ',
        propietario: this.user.username,
        tipo_archivo: FileType.NORMAL,
        contenido: getDefaultContentFile(),
        createdAt: '',
        updatedAt: '',
      }

      if (fileExtension == Extensiones.PNG || fileExtension == Extensiones.JPG) {
        console.log('todo bien')
        const form = new FormData();
        form.append('archivo', this.selectedFile);
        form.append('archivoJson', JSON.stringify(archivo));
        this.serviceFile.updateImage(form).subscribe(
          () => {
            this.updateDirectories(this.directoryActual);
            this.snackBar.open('Se ha actualizado correctamen la imagen', 'Cerrar', { duration: 2000 });
          },
          (error) => {
            console.log(error)
            if (error.status == 400) {
              this.snackBar.open('No se seleccion ningún archivo', 'Cerrar', { duration: 2000 });
            } else if (error.status == 401) {
              this.snackBar.open(`El archivo ${archivo.nombre} ya existe`, 'Cerrar', { duration: 2000 });
            } else {
              this.snackBar.open('No se pudo guardar los cambios', 'Cerrar', { duration: 2000 });
            }
          }
        );
      }

    } else {
      this.snackBar.open('No se selecciono ningún archivo', 'Cerrar', { duration: 2000 });
    }

  }


  logout() {
    this.session.cerrarSesion();
  }
}
