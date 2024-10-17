import { PromiseExecutor } from '@nx/devkit';
import { ImageBuildExecutorSchema } from './schema';
import * as dockerode from 'dockerode';
import { DockerDefaultConfig } from '../../common';

const runExecutor: PromiseExecutor<ImageBuildExecutorSchema> = async (
  options
) => {
  console.log('Building image');
  const docker = new dockerode(options.docker || DockerDefaultConfig);

  const stream = await docker.buildImage(
    {
      context: options.context,
      src: [options.dockerfile || 'Dockerfile'],
    },
    {
      target: options.target,
      t: options.tag,
    }
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
