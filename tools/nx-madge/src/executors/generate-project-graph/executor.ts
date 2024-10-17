import { type PromiseExecutor } from '@nx/devkit';
import madge from 'madge';

import { ToolsNxMadgePluginGenerateProjectGraphExecutorSchema } from './schema';

const runExecutor: PromiseExecutor<ToolsNxMadgePluginGenerateProjectGraphExecutorSchema> = async (
  options,
  context
) => {
  console.log('Executor ran for ToolsNxMadgePluginSrcExecutorsGenerateProjectDepsGraph', options);
  console.log({ options });
  console.log({ context });
  await madge('', options.config);

  return {
    success: true,
  };
}

export default runExecutor;
