import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDropdownComponent } from './mat-dropdown.component';

describe('MatDropdownComponent', () => {
  let component: MatDropdownComponent;
  let fixture: ComponentFixture<MatDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
