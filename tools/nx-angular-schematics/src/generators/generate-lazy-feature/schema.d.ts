import { type OverwriteStrategy } from '@nx/devkit';

export interface GenerateLazyFeatureGeneratorSchema {
  appName: string;
  featureName: string;
  generatorOverwriteStrategy: OverwriteStrategy;
}
