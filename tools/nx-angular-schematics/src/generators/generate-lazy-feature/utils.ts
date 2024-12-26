import { readProjectConfiguration, type Tree, type ProjectConfiguration } from '@nx/devkit';

export function componentSelectorPrefixCreator(tree: Tree, appName: string): string {
  return (readProjectConfiguration(tree, appName) as ProjectConfiguration & { prefix: string }).prefix;
}
