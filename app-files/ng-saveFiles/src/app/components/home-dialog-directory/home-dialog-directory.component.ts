import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Directory } from 'src/app/models/entidad/Directory';

@Component({
  selector: 'app-home-dialog-directory',
  templateUrl: './home-dialog-directory.component.html',
  styleUrls: ['./home-dialog-directory.component.css']
})
export class HomeDialogDirectoryComponent {

  constructor(
    public dialogRef: MatDialogRef<HomeDialogDirectoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Directory
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
