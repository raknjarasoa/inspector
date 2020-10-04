import { Rule, Tree, SchematicsException, SchematicContext, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addModuleImportToRootModule,
  getProjectFromWorkspace,
  getWorkspace,
  WorkspaceProject,
} from 'schematics-utilities';

import { Schema } from './schema';

export function ngAdd(options: Schema): Rule {
  return (tree: Tree) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    return chain([installPackageJsonDependencies(), addModuleToImports(options)]);
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());

    return host;
  };
}

function addModuleToImports(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(
      workspace,
      options.project ? options.project : Object.keys(workspace.projects)[0]
    );

    if (project.projectType === 'library') {
      throw new SchematicsException('This library should only be added to application type of projects.');
    }

    const moduleName = 'InspectorModule';

    addModuleImportToRootModule(host, moduleName, '@ngneat/inspector', project as WorkspaceProject);
    context.logger.log('info', `✅️ "${moduleName}" is imported`);

    return host;
  };
}
