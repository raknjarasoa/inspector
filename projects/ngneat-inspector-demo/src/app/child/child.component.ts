import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styles: [],
})
export class ChildComponent implements OnInit {
  title = 'I am child component';
  @Output() callParent = new EventEmitter();
  constructor() {}

  fun(): void {
    console.log('fun called');
  }

  ngOnInit(): void {}
}
