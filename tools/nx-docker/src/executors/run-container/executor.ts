import { PromiseExecutor } from '@nx/devkit';
import { RunContainerExecutorSchema } from './schema';
import * as dockerode from 'dockerode';
import { DockerDefaultConfig } from '../../common';
import { ImageInspectInfo } from 'dockerode';

const runExecutor: PromiseExecutor<RunContainerExecutorSchema> = async (
  options
) => {
  console.log('Executor ran for RunContainer', options);

  const { image, docker, ...containerOptions } = options;

  const dockerClient = new dockerode(docker || DockerDefaultConfig);
  const img = await dockerClient.getImage(options.image);
  let imgInfo: ImageInspectInfo;

  try {
    imgInfo = await img.inspect();
  } catch (e) {
    throw new Error(`Image ${options.image} not found`);
  }

  await dockerClient.listContainers();

  const container = await dockerClient.createContainer({
    Image: imgInfo.Id,
    ...containerOptions,
  });

  console.log('Container created', container.id);

  await container.start();

  return {
    success: true,
  };
};

export default runExecutor;
