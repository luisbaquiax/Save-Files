import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/models/entidad/User';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-UsersList',
  templateUrl: './UsersList.component.html',
  styleUrls: ['./UsersList.component.css']
})
export class UsersListComponent implements OnInit {

  users: User[] = []
  user!: User;

  constructor(
    private serviceUser: UsersService,
    public dialogRef: MatDialogRef<UsersListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.setUsers();
    let userJson = localStorage.getItem('userLogin');
    this.user = userJson? JSON.parse(userJson) : null;

  }

  ngOnInit(): void {
    this.setUsers();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  setUsers(){
    this.serviceUser.getUsers().subscribe((data) => {
      this.users = data;
      if(this.user){
        this.users = this.users.filter((user) => user._id!=this.user._id);
      }
    });
  }

}
