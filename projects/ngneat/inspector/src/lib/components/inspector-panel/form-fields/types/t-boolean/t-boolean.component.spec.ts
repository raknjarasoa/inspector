import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TBooleanComponent } from './t-boolean.component';

describe('TBooleanComponent', () => {
  let component: TBooleanComponent;
  let fixture: ComponentFixture<TBooleanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TBooleanComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
