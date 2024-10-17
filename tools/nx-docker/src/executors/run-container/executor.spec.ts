import { ExecutorContext } from '@nx/devkit';

import { RunContainerExecutorSchema } from './schema';
import executor from './executor';

const options: RunContainerExecutorSchema = {
  containerName: '',
  context: '',
  docker: {},
  dockerfile: '',
  target: '',
};
const context: ExecutorContext = {
  root: '',
  cwd: process.cwd(),
  isVerbose: false,
};

describe.skip('RunContainer Executor', () => {
  it('can run', async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
