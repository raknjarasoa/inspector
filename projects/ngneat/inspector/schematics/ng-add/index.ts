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
import { getProjectTargetOptions } from 'schematics-utilities/dist/cdk';

import { Schema } from './schema';

const stylePath = './node_modules/@ngneat/inspector/styles.scss';

export function ngAdd(options: Schema): Rule {
  return (tree: Tree) => {
    const workspaceConfig = tree.read('/angular.json');
    if (!workspaceConfig) {
      throw new SchematicsException('Could not find Angular workspace configuration');
    }

    return chain([
      addPackageJsonDependencies(),
      installPackageJsonDependencies(),
      addStyles(options, insertCommonStyles),
      addModuleToImports(options),
    ]);
  };
}

function addPackageJsonDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const dependencies: NodeDependency[] = [
      {
        type: NodeDependencyType.Dev,
        version: '^10.2.2',
        name: '@angular/cdk',
      },
      {
        type: NodeDependencyType.Dev,
        version: '^0.7.0',
        name: '@fortawesome/angular-fontawesome',
      },
      {
        type: NodeDependencyType.Dev,
        version: '^1.2.30',
        name: '@fortawesome/fontawesome-svg-core',
      },
      {
        type: NodeDependencyType.Dev,
        version: '^5.14.0',
        name: '@fortawesome/free-solid-svg-icons',
      },
      {
        type: NodeDependencyType.Dev,
        version: '^4.5.2',
        name: 'bootstrap',
      },
      {
        type: NodeDependencyType.Dev,
        version: '^6.1.0',
        name: 'ngx-bootstrap',
      },
    ];

    dependencies.forEach((dependency) => {
      addPackageJsonDependency(host, dependency);
      context.logger.log('info', `✅️ Added "${dependency.name}" into ${dependency.type}`);
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

export function addStyles(options: Schema, insertStyle: (options: Schema, host: Tree) => void): Rule {
  return (host: Tree, context: SchematicContext): Tree => {
    insertStyle(options, host);

    context.logger.log('info', `✅️ style.scss is added in angular.json`);

    return host;
  };
}

function insertCommonStyles(options: Schema, host: Tree): void {
  addStyleToTarget(options, 'build', host, stylePath);
  addStyleToTarget(options, 'test', host, stylePath);
}

export function addStyleToTarget(options: Schema, targetName: string, host: Tree, assetPath: string): void {
  const workspace = getWorkspace(host);
  const project = getProjectFromWorkspace(
    workspace,
    options.project ? options.project : Object.keys(workspace.projects)[0]
  );
  const targetOptions = getProjectTargetOptions(project, targetName);

  if (!targetOptions.styles) {
    targetOptions.styles = [assetPath];
  } else {
    const existingStyles = targetOptions.styles.map((style: string | { input: string }) => {
      return typeof style === 'string' ? style : style.input;
    });

    const hasBootstrapStyle = existingStyles.find((style: string) => {
      return style.includes(assetPath);
    });

    if (!hasBootstrapStyle) {
      targetOptions.styles.unshift(assetPath);
    }
  }

  host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}
