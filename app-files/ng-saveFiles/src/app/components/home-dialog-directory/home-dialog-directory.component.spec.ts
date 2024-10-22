import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDialogDirectoryComponent } from './home-dialog-directory.component';

describe('HomeDialogDirectoryComponent', () => {
  let component: HomeDialogDirectoryComponent;
  let fixture: ComponentFixture<HomeDialogDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDialogDirectoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeDialogDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
