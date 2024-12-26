import { PromiseExecutor } from '@nx/devkit';
import { ImageBuildExecutorSchema } from './schema';
import * as dockerode from 'dockerode';
import { DockerDefaultConfig } from '../../common';

const runExecutor: PromiseExecutor<ImageBuildExecutorSchema> = async (
  options
) => {
  const { docker, context, src, ...buildOptions } = options;
  const dockerClient = new dockerode(docker || DockerDefaultConfig);

  const stream = await dockerClient.buildImage(
    {
      context: context || '.',
      src: src || ['./'],
    },
    buildOptions
  );

  await new Promise((resolve, reject) => {
    dockerClient.modem.followProgress(
      stream,
      (err, res) => {
        if (err) {
          console.log('qweqweqwe');
          reject(err);
        } else {
          console.log('bibibi');
          resolve(res);
        }
      },
      (event) => console.info(event)
    );
  });

  return {
    success: true,
  };
};

export default runExecutor;
