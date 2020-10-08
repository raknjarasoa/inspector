import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DragNDropDirective } from './drag-n-drop.directive';

@Component({
  template: ` <div ngneatDragNDrop></div> `,
})
class TestComponent {}

describe('DragNDropDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[]; // the element w/ the directive

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [DragNDropDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached DragNDropDirective
    des = fixture.debugElement.queryAll(By.directive(DragNDropDirective));
  });

  it('should one element with directive', () => {
    expect(des.length).toBe(1);
  });
});
