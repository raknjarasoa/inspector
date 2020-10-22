import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as ace from 'ace-builds';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = { a: 'a' };

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
