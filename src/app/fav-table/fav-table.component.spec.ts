import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavTableComponent } from './fav-table.component';

describe('FavTableComponent', () => {
  let component: FavTableComponent;
  let fixture: ComponentFixture<FavTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
