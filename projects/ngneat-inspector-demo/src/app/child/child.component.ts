import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styles: [],
})
export class ChildComponent implements OnInit {
  title = 'I am child component';
  text = 'child works!';
  number = 3;
  bool = false;
  arr = ['a', 'b'];
  obj = { a: 'a', b: 'b' };
  sub = new Subject();
  @Output() callParent = new EventEmitter();
  constructor() {}

  fun(arg1 = 'hi'): void {
    console.log('fun called with:', arg1);
  }

  ngOnInit(): void {}
}
