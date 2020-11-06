import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mat-dropdown',
  templateUrl: './mat-dropdown.component.html',
  styleUrls: ['./mat-dropdown.component.scss'],
})
export class MatDropdownComponent implements OnInit {
  // @ts-ignore
  @Input() ddlConfig: DdlConfig;

  @Input() control: FormControl;

  @Input() list: any[];

  // tslint:disable-next-line: no-output-native
  @Output() change: EventEmitter<any>;

  constructor() {
    this.change = new EventEmitter<any>();
    this.control = new FormControl();
    this.list = [];
  }

  ngOnInit(): void {}

  selectionChange(): void {
    if (this.change && this.change.observers.length) {
      this.change.emit();
    }
  }
}

export interface DdlConfig {
  label: string;
  id: string;
  placeholder?: string;
  tooltip?: string;
  required?: boolean;
  valueField?: string;
  optionLabels?: string[];
  separator?: string;
  withNone?: boolean;
}
