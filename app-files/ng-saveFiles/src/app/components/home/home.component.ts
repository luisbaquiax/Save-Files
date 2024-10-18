import { Component, OnInit } from '@angular/core';
import { Directory } from 'src/app/models/entidad/Directory';
import { User } from 'src/app/models/entidad/User';
import { DirectoryService } from 'src/app/services/serviceDirectories/directory.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';



export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource = ELEMENT_DATA;

  isExpanded = true;

  user: User;
  directoryRoot!: Directory;

  constructor(private session: SesionService, private serviceDirectory: DirectoryService) {
    let useJson = localStorage.getItem('user');
    this.user = useJson ? JSON.parse(useJson) : null;

    this.setDirectoryRoot();
  }

  ngOnInit() {
    this.session.validarSesion();
    this.setDirectoryRoot();
  }

  setDirectoryRoot() {
    this.serviceDirectory.getRoot(this.user.username).subscribe((data) => {
      this.directoryRoot = data;
    });
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  action1(position: number) {
    console.log('position ', position);
  }
}
