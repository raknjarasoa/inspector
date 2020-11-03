import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FieldHostDirective } from './field-host.directive';

@Component({
  template: ` <div ngneatFieldHost></div> `,
})
class TestComponent {}

describe('FieldHostDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[]; // the element w/ the directive

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [FieldHostDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached FieldHostDirective
    des = fixture.debugElement.queryAll(By.directive(FieldHostDirective));
  });

  it('should one element with directive', () => {
    expect(des.length).toBe(1);
  });
});
