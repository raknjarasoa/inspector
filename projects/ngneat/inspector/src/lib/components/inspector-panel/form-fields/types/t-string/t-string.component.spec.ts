import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TStringComponent } from './t-string.component';

describe('TStringComponent', () => {
  let component: TStringComponent;
  let fixture: ComponentFixture<TStringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TStringComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
