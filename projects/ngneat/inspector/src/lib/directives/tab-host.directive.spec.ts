import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TabHostDirective } from './tab-host.directive';

@Component({
  template: ` <div ngneatTabHost></div> `,
})
class TestComponent {}

describe('TabHostDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let des: DebugElement[]; // the element w/ the directive

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TabHostDirective, TestComponent],
    }).createComponent(TestComponent);

    fixture.detectChanges(); // initial binding

    // all elements with an attached TabHostDirective
    des = fixture.debugElement.queryAll(By.directive(TabHostDirective));
  });

  it('should one element with directive', () => {
    expect(des.length).toBe(1);
  });
});
