import type { MadgeConfig } from 'madge';

export interface ToolsNxMadgePluginGenerateProjectGraphExecutorSchema {
  madgeConfig: MadgeConfig;
  rootFileName: string;
  imageType: 'svg' | 'png' | 'jpg' | 'jpeg' | 'pdf';
  circularOnly: boolean;
  graphsDir: string;
  resolvingAliasedModules: boolean;
}
