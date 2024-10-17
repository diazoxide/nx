import { ExecutorContext } from '@nx/devkit';

import { ToolsNxMadgePluginGenerateProjectGraphExecutorSchema } from './schema';

import executor from './executor';

const options: ToolsNxMadgePluginGenerateProjectGraphExecutorSchema = {} as ToolsNxMadgePluginGenerateProjectGraphExecutorSchema;
const context: ExecutorContext = {} as ExecutorContext;

describe('ToolsNxMadgePluginSrcExecutorsGenerateProjectDepsGraph Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
