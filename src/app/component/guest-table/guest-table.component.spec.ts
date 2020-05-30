import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTableComponent } from './guest-table.component';

describe('GuestTableComponent', () => {
  let component: GuestTableComponent;
  let fixture: ComponentFixture<GuestTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
