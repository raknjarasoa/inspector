import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DragHandleDirective } from './drag-handle.directive';

@Component({
  template: ` <div ngneatDragHandle></div> `,
})
class TestComponent {}

describe('DragHandleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[]; // the element w/ the directive

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [DragHandleDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached DragHandleDirective
    des = fixture.debugElement.queryAll(By.directive(DragHandleDirective));
  });

  it('should one element with directive', () => {
    expect(des.length).toBe(1);
  });
});
