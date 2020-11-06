import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as ace from 'ace-builds';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = undefined;
  typeList: ListOpt[];
  formCtrl: FormGroup;

  constructor() {
    this.formCtrl = new FormGroup({ type: new FormControl() });
    this.typeList = [
      { id: 1, field: 'test1', label: 'test1' },
      { id: 2, field: 'test2', label: 'test2' },
      { id: 3, field: 'test3', label: 'test3' },
      { id: 4, field: 'test4', label: 'test4' },
      { id: 5, field: 'test5', label: 'test5' },
      { id: 6, field: 'test6', label: 'test6' },
    ];
  }

  callParent(): void {
    console.log('Parent called');
  }

  ngOnInit(): void {
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    var editor = ace.edit('editor');
    editor.setTheme('ace/theme/monokai');
    editor.session.setMode('ace/mode/javascript');
  }
}

export interface ListOpt {
  id: any;
  label: string;
  field?: string;
}
