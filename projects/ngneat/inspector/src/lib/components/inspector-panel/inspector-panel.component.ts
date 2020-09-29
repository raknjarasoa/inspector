import { Component, Input, OnInit } from '@angular/core';
import { NgComponent } from '../../inspector.model';

@Component({
  selector: 'ngneat-inspector-panel',
  templateUrl: './inspector-panel.component.html',
  styleUrls: ['./inspector-panel.component.scss'],
})
export class InspectorPanelComponent implements OnInit {
  @Input() ngComponent: NgComponent;

  constructor() {}

  ngOnInit(): void {}
}
