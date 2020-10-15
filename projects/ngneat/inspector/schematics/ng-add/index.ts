import { Rule, Tree, SchematicsException, chain, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  getProjectFromWorkspace,
  getWorkspace,
  getAppModulePath,
  addPackageJsonDependency,
  NodeDependency,
  NodeDependencyType,
  addModuleImportToRootModule,
  WorkspaceProject,
  targetBuildNotFoundError,
} from 'schematics-utilities';
import { insertImport, isImported } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

import { Schema } from './schema';
import { getTsSourceFile } from './utils';

export function ngAdd(options: Schema): Rule {
  return (tree: Tree) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    return chain([
      addDependencies(),
      installPackageJsonDependencies(),
      injectImports(options),
      addModuleToImports(options),
    ]);
  };
}

function addDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [{ type: NodeDependencyType.Dev, version: '^1.21.0', name: 'prismjs' }];

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
    });
    context.logger.log('info', '✅️ Added "@ngneat/inspector" into devDependencies');

    return host;
  };
}

function installPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `🔍 Installing packages...`);

    return host;
  };
}

function injectImports(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    if (!options.skipImport) {
      const workspace = getWorkspace(host);
      const project = getProjectFromWorkspace(
        workspace,
        options.project ? options.project : Object.keys(workspace.projects)[0]
      );

      if (!project || project.projectType !== 'application') {
        throw new SchematicsException(`A client project type of "application" is required.`);
      }

      if (
        !project.architect ||
        !project.architect.build ||
        !project.architect.build.options ||
        !project.architect.build.options.main
      ) {
        throw targetBuildNotFoundError();
      }

      const modulePath = getAppModulePath(host, project.architect.build.options.main);
      const moduleSource = getTsSourceFile(host, modulePath);
      const importModule = 'environment';
      const importPath = '../environments/environment';

      if (!isImported(moduleSource, importModule, importPath)) {
        const change = insertImport(moduleSource, modulePath, importModule, importPath);

        if (change) {
          const recorder = host.beginUpdate(modulePath);
          recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
          host.commitUpdate(recorder);
          context.logger.log('info', '✅ Written import statement for "environments"');
        }
      }

      const inspectorModuleChange = insertImport(moduleSource, modulePath, 'InspectorModule', '@ngneat/inspector');
      if (inspectorModuleChange) {
        const recorder = host.beginUpdate(modulePath);
        recorder.insertLeft((inspectorModuleChange as InsertChange).pos, (inspectorModuleChange as InsertChange).toAdd);
        host.commitUpdate(recorder);
        context.logger.log('info', '✅ Written import statement for "InspectorModule"');
      }
      return host;
    }
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

      if (!project || project.projectType !== 'application') {
        throw new SchematicsException(`A client project type of "application" is required.`);
      }

      const importInspectorModule = 'environment.production ? [] : InspectorModule.forRoot()';

      addModuleImportToRootModule(host, importInspectorModule, null as any, project as WorkspaceProject);

      context.logger.log('info', '✅ Imported "InspectorModule" as non-production in imports');
    }

    return host;
  };
}
