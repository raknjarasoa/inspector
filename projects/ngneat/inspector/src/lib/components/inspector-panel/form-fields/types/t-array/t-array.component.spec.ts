import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TArrayComponent } from './t-array.component';

describe('TArrayComponent', () => {
  let component: TArrayComponent;
  let fixture: ComponentFixture<TArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TArrayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
