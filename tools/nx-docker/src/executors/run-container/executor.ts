import { PromiseExecutor } from '@nx/devkit';
import { RunContainerExecutorSchema } from './schema';
import * as dockerode from 'dockerode';
import { DockerDefaultConfig } from '../../common';
import { ImageInspectInfo } from 'dockerode';

const runExecutor: PromiseExecutor<RunContainerExecutorSchema> = async (
  options
) => {
  console.log('Executor ran for RunContainer', options);

  const docker = new dockerode(options.docker || DockerDefaultConfig);

  const img = await docker.getImage(options.containerName);
  let imgInfo: ImageInspectInfo;

  try {
    imgInfo = await img.inspect();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    const stream = await docker.buildImage(
      {
        context: options.context,
        src: [options.dockerfile || 'Dockerfile'],
      },
      {
        target: options.target,
        t: options.containerName,
      }
    );

    await new Promise((resolve, reject) => {
      docker.modem.followProgress(
        stream,
        (err, res) => (err ? reject(err) : resolve(res)),
        (event) => console.info(event)
      );
    });

    const img = await docker.getImage(options.containerName);
    imgInfo = await img.inspect();
  }

  await docker.listContainers();

  const container = await docker.createContainer({
    Image: imgInfo.Id,
    name: options.containerName + '-container',
    Cmd: ['/bin/sh', '-c', 'while true; do echo hello world; sleep 1; done'],
    // Env: options.env,
    // HostConfig: options.hostConfig,
  });

  await container.start();

  return {
    success: true,
  };
};

export default runExecutor;
