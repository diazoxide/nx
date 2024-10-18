import type { ToolsNxMadgePluginGenerateProjectGraphExecutorSchema } from '../executors/generate-project-graph/schema';

export const NX_MADGE_PLUGIN_SCHEMA_DEFAULT_OPTIONS: ToolsNxMadgePluginGenerateProjectGraphExecutorSchema = {
  madgeConfig: {},
  rootFileName: 'main.ts',
  circularOnly: false,
  imageType: 'svg',
  graphsDir: '{workspaceRoot}/graph',
  resolvingAliasedModules: false,
};
