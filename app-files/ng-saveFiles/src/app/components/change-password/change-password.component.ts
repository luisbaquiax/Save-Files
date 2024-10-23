import { Component, Inject } from '@angular/core';
import { User } from 'src/app/models/entidad/User';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
