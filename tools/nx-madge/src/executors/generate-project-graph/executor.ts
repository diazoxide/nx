import * as fs from 'fs';
import { type PromiseExecutor, logger, workspaceRoot } from '@nx/devkit';
import * as madge from 'madge';
import {
  type MadgePath,
  type MadgeConfig,
  type MadgeInstance
} from 'madge';

import { NX_MADGE_PLUGIN_SCHEMA_DEFAULT_OPTIONS } from '../../common/default-options';
import type { ToolsNxMadgePluginGenerateProjectGraphExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<ToolsNxMadgePluginGenerateProjectGraphExecutorSchema> = async (options, context) => {
  logger.log('Executor ran for ToolsNxMadgePluginSrcExecutorsGenerateProjectDepsGraph', options);

  options = mergeOptions(NX_MADGE_PLUGIN_SCHEMA_DEFAULT_OPTIONS, options);

  const projectConfig = context.projectsConfigurations.projects[context.projectName];
  const projectRoot = projectConfig.root;
  const madgePath: MadgePath = `${projectRoot}/src/${options.rootFileName}`;
  const madgeConfig: MadgeConfig = {
    ...options.madgeConfig,
    tsConfig: options.resolvingAliasedModules ? `${projectRoot}/tsconfig.json` : undefined,
  };
  const madgeInstance: MadgeInstance = await madge(madgePath, madgeConfig);
  const graphsDir = prepareGraphsDir(options.graphsDir, workspaceRoot);
  const imagePath = `${graphsDir}/${context.projectName}.${options.imageType}`;
  const writtenImagePath: string = await madgeInstance.image(imagePath, options.circularOnly);

  logger.log(`Image written to ${writtenImagePath}`);

  return {
    success: true
  };
}

function mergeOptions(
  defaultOptions: ToolsNxMadgePluginGenerateProjectGraphExecutorSchema,
  executorOptions: ToolsNxMadgePluginGenerateProjectGraphExecutorSchema
): ToolsNxMadgePluginGenerateProjectGraphExecutorSchema {
  return {
    ...defaultOptions,
    ...executorOptions,
    madgeConfig: {
      ...defaultOptions.madgeConfig,
      ...executorOptions.madgeConfig
    }
  };
}

function prepareGraphsDir(graphsDir: ToolsNxMadgePluginGenerateProjectGraphExecutorSchema['graphsDir'], workspaceRoot: string) {
  graphsDir = graphsDir.replace('{workspaceRoot}', workspaceRoot);
  if (!fs.existsSync(graphsDir)) {
    fs.mkdirSync(graphsDir, { recursive: true });
  }
  return graphsDir;
}

export default runExecutor;
