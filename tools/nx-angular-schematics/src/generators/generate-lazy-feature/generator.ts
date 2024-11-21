import * as path from 'path';

import { type Tree, OverwriteStrategy, formatFiles, generateFiles, names } from '@nx/devkit';

import { type GenerateLazyFeatureGeneratorSchema } from './schema';
import { componentSelectorPrefixCreator } from './utils';

export interface GenerateLazyFeatureGeneratorSubstitutions {
  componentSelectorPrefix: string;
  featureName: GenerateLazyFeatureGeneratorSchema['featureName'];
  featureNameVariations: ReturnType<typeof names>;
}

export default async function (tree: Tree, schema: GenerateLazyFeatureGeneratorSchema) {
  const appPath = `apps/${schema.appName}/src/app`;
  const featurePath = `${appPath}/feature`;

  // Validate the application path
  if (!tree.exists(appPath)) {
    throw new Error(`Application ${schema.appName} does not exist in the apps folder.`);
  }

  // Generate folder structure
  const featureFolderPath = `${featurePath}/${schema.featureName}`;

  // Generate files from templates by replacing variables
  generateFiles(
    tree,
    path.join(__dirname, './files'),
    featureFolderPath,
    {
      componentSelectorPrefix: componentSelectorPrefixCreator(tree, schema.appName),
      featureName: schema.featureName,
      featureNameVariations: names(schema.featureName),
    } satisfies GenerateLazyFeatureGeneratorSubstitutions,
    {
      overwriteStrategy: schema.generatorOverwriteStrategy ?? OverwriteStrategy.ThrowIfExisting,
    },
  );

  await formatFiles(tree);
}
