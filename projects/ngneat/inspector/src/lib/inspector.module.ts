import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CodeEditorModule } from '@ngstack/code-editor';

import { InspectorPanelComponent } from './components/inspector-panel/inspector-panel.component';
import { InspectorComponent } from './inspector.component';
import { TypeSelectorComponent } from './components/inspector-panel/form-fields/type-selector/type-selector.component';
import { TStringComponent } from './components/inspector-panel/form-fields/types/t-string/t-string.component';
import { TNumberComponent } from './components/inspector-panel/form-fields/types/t-number/t-number.component';
import { TBooleanComponent } from './components/inspector-panel/form-fields/types/t-boolean/t-boolean.component';
import { TNotSupportedComponent } from './components/inspector-panel/form-fields/types/t-not-supported/t-not-supported.component';
import { InspectorTabComponent } from './components/inspector-panel/inspector-tab/inspector-tab.component';
import { TObjectComponent } from './components/inspector-panel/form-fields/types/t-object/t-object.component';

import { FieldHostDirective } from './directives/field-host.directive';
import { TabHostDirective } from './directives/tab-host.directive';
import { DragNDropDirective } from './directives/drag-n-drop.directive';
import { DragHandleDirective } from './directives/drag-handle.directive';

import { InspectorConfig } from './inspector.model';

import { InspectorService } from './services/inspector.service';
import { init } from './init';

@NgModule({
  declarations: [
    InspectorComponent,
    InspectorPanelComponent,
    TypeSelectorComponent,
    TStringComponent,
    TNumberComponent,
    TBooleanComponent,
    TObjectComponent,
    TNotSupportedComponent,
    FieldHostDirective,
    TabHostDirective,
    InspectorTabComponent,
    DragNDropDirective,
    DragHandleDirective,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, ReactiveFormsModule, CodeEditorModule.forChild()],
  exports: [InspectorComponent],
  providers: [InspectorService],
})
export class InspectorModule {
  static forRoot(config?: Partial<InspectorConfig>): ModuleWithProviders<InspectorModule> {
    return {
      ngModule: InspectorModule,
      providers: [
        { provide: InspectorConfig, useValue: config },
        {
          provide: APP_INITIALIZER,
          useFactory: init,
          deps: [InspectorService],
          multi: true,
        },
      ],
    };
  }
}
