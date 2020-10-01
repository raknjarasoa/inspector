import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TNotSupportedComponent } from './t-not-supported.component';

describe('TNotSupportedComponent', () => {
  let component: TNotSupportedComponent;
  let fixture: ComponentFixture<TNotSupportedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TNotSupportedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TNotSupportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
