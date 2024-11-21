import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { OverwriteStrategy, readProjectConfiguration, Tree } from '@nx/devkit';

import generateLazyFeatureGenerator from './generator';
import { GenerateLazyFeatureGeneratorSchema } from './schema';

describe('generate-lazy-feature generator', () => {
  let tree: Tree;
  const options: GenerateLazyFeatureGeneratorSchema = {
    appName: 'account-console-ui',
    featureName: 'report',
    generatorOverwriteStrategy: OverwriteStrategy.ThrowIfExisting,
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generateLazyFeatureGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
