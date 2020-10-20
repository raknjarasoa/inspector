import { Rule, Tree, SchematicsException, chain, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { insertImport, isImported } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { getWorkspace } from '@schematics/angular/utility/config';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';

import { Schema } from './schema';
import { addModuleImportToRootModule, addPackageToPackageJson, getProjectFromWorkspace, getSourceFile } from './utils';
import { hasNgModuleImport } from './utils/ng-module-imports';
import { targetBuildNotFoundError } from './utils/project-targets';

// we don't need to add bootstrap in this, cz we are purely using scss format so it is bundled in our lib
// @ngneat/inspector is added automatically in package.json, cz we have added below section in our package.json:
// "ng-add": {
// "save": "devDependencies"
// }
const dependencies = [
  { version: '^2.1.0', name: '@ngstack/code-editor' },
  { version: '^0.21.2', name: 'monaco-editor' },
  { version: '^1.1.0', name: 'tinykeys' },
];

const importModuleSet = [
  {
    moduleName: 'environment',
    importModuleStatement: 'environment',
    importPath: '../environments/environment',
    staticFile: true,
  },
  {
    moduleName: 'InspectorModule',
    importModuleStatement: 'environment.production ? [] : InspectorModule.forRoot()',
    importPath: '@ngneat/inspector',
  },
  // {
  //   moduleName: 'CodeEditorModule',
  //   importModuleStatement: 'environment.production ? [] : CodeEditorModule.forRoot()',
  //   importPath: '@ngstack/code-editor',
  // },
];

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
    context.logger.log('info', '✅️ Added "@ngneat/inspector" into devDependencies');

    dependencies.forEach((dependency) => {
      addPackageToPackageJson(host, dependency.name, `${dependency.version}`);
      context.logger.log('info', `✅️ Added "${dependency.name}" into devDependencies`);
    });

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
      const moduleSource = getSourceFile(host, modulePath);

      importModuleSet.forEach((item) => {
        if (isImported(moduleSource, item.moduleName, item.importPath)) {
          context.logger.warn(`Could not import "${item.moduleName}" because it's already imported.`);
        } else {
          const change = insertImport(moduleSource, modulePath, item.moduleName, item.importPath);

          if (change) {
            const recorder = host.beginUpdate(modulePath);
            recorder.insertLeft((change as InsertChange).pos, (change as InsertChange).toAdd);
            host.commitUpdate(recorder);
            context.logger.log('info', '✅ Written import statement for "' + item.moduleName + '"');
          }
        }
      });
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
      if (!project.architect) {
        throw new SchematicsException(`Architect options not present for project.`);
      }
      if (!project.architect.build) {
        throw new SchematicsException(`Architect:Build options not present for project.`);
      }

      const modulePath = getAppModulePath(host, project.architect.build.options.main);

      importModuleSet.forEach((item) => {
        if (!item.staticFile) {
          if (
            hasNgModuleImport(host, modulePath, item.importModuleStatement) ||
            hasNgModuleImport(host, modulePath, item.moduleName)
          ) {
            context.logger.warn(`Could not set up "${item.moduleName}" in "imports[]" because it's already imported.`);
          } else {
            addModuleImportToRootModule(host, item.importModuleStatement, null as any, project);
            context.logger.log('info', '✅ Imported "' + item.moduleName + '" as non-production in imports');
          }
        }
      });
    }

    return host;
  };
}
