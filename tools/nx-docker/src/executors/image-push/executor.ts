import { PromiseExecutor } from '@nx/devkit';
import { ImagePushExecutorSchema } from './schema';
import * as dockerode from 'dockerode';
import { DockerDefaultConfig } from '../../common';

const runExecutor: PromiseExecutor<ImagePushExecutorSchema> = async (
  options
) => {
  console.log('Pushing image');
  const docker = new dockerode(options.docker || DockerDefaultConfig);

  const image = await docker.getImage(options.tag);
  const img = await image.inspect();
  console.log(`Pushing image: "${img.Id}"`);

  await Promise.all(
    options.tags.map(async (tag) => {
      const cleanRegistry = options.registry.replace(/\/$/, '');
      const cleanRepoName = options.repository.replace(/\/$/, '');

      await image.tag({
        tag: `${tag}`,
        repo: `${cleanRegistry}/${cleanRepoName}`,
      });

      const imgToPush = await docker.getImage(
        `${options.registry}/${options.repository}:${tag}`
      );

      const stream = await imgToPush.push({
        tag,
        authconfig: {
          username: options.username,
          password: options.password,
          serveraddress: options.registry,
        },
      });

      await new Promise((resolve, reject) => {
        docker.modem.followProgress(
          stream,
          (err, res) => (err ? reject(err) : resolve(res)),
          (event) => console.log(event)
        );
      });
    })
  );

  return {
    success: true,
  };
};

export default runExecutor;
