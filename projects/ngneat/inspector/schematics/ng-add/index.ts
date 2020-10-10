import { Rule, Tree, SchematicsException, SchematicContext, chain } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addModuleImportToRootModule,
  addPackageJsonDependency,
  getProjectFromWorkspace,
  getWorkspace,
  NodeDependency,
  NodeDependencyType,
  WorkspaceProject,
} from 'schematics-utilities';

import { Schema } from './schema';

export function ngAdd(options: Schema): Rule {
  return (tree: Tree) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    return chain([addDependencies(), installPackageJsonDependencies(), addModuleToImports(options)]);
  };
}

function addDependencies(): Rule {
  return (host: Tree) => {
    const dependencies: NodeDependency[] = [{ type: NodeDependencyType.Dev, version: '1.21.0', name: 'prismjs' }];

    // 2. Just use it whenever you need :)
    dependencies.forEach((dependency) => addPackageJsonDependency(host, dependency));

    return host;
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
    if (!options.skipImport) {
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
    }

    return host;
  };
}
