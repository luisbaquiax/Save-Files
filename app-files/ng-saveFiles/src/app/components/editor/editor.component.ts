import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Editor } from 'src/app/models/entidad/Editor';
import { TipoArchivo } from 'src/app/models/entidad/TipoArchivo';
import { Extensiones } from 'src/app/models/enums/Extensiones';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent  {

  tipos: TipoArchivo[] = [
    {type: Extensiones.TXT},
    {type: Extensiones.HTML},
  ];

  constructor(
    public dialogRef: MatDialogRef<EditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Editor
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
