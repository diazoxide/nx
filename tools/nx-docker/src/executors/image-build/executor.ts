import { PromiseExecutor } from '@nx/devkit';
import { ImageBuildExecutorSchema } from './schema';
import * as dockerode from 'dockerode';
import { DockerDefaultConfig } from '../../common';

const runExecutor: PromiseExecutor<ImageBuildExecutorSchema> = async (
  options
) => {
  const docker = new dockerode(options.docker || DockerDefaultConfig);
  const { context, src, ...buildOptions } = options;

  const stream = await docker.buildImage(
    {
      context: context || '.',
      src: src || ['./'],
    },
    buildOptions
  );

  await new Promise((resolve, reject) => {
    docker.modem.followProgress(
      stream,
      (err, res) => (err ? reject(err) : resolve(res)),
      (event) => console.info(event)
    );
  });

  return {
    success: true,
  };
};

export default runExecutor;
