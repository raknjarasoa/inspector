import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TNumberComponent } from './t-number.component';

describe('TNumberComponent', () => {
  let component: TNumberComponent;
  let fixture: ComponentFixture<TNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TNumberComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
