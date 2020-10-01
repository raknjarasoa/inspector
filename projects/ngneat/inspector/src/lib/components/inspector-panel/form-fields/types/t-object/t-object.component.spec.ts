import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TObjectComponent } from './t-object.component';

describe('TObjectComponent', () => {
  let component: TObjectComponent;
  let fixture: ComponentFixture<TObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TObjectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
