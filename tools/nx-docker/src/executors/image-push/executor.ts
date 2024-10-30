import { PromiseExecutor } from '@nx/devkit';
import { ImagePushExecutorSchema } from './schema';
import * as dockerode from 'dockerode';
import { DockerDefaultConfig } from '../../common';

const runExecutor: PromiseExecutor<ImagePushExecutorSchema> = async (
  options
) => {
  console.log('Pushing image');
  const docker = new dockerode(options.docker || DockerDefaultConfig);

  const image = await docker.getImage(options.tagToPush);
  const img = await image.inspect();
  console.log(`Pushing image: "${img.Id}"`);

  const remoteTags = [];
  if (typeof options.remoteTag === 'string') {
    remoteTags.push(options.remoteTag);
  } else if (Array.isArray(options.remoteTag)) {
    remoteTags.push(...options.remoteTag);
  } else {
    throw new Error('remoteTag must be a string or an array of strings');
  }

  await Promise.all(
    remoteTags.map(async (tag) => {
      // Remove leading and trailing slashes
      const cleanRegistry = options.registry.replace(/^\/|\/$/g, '');
      const cleanRepo = options.repository.replace(/^\/|\/$/g, '');
      const cleanSubRepo = options.subRepository?.replace(/^\/|\/$/g, '');

      let finalRepoName = cleanRepo

      if (cleanRepo) {
        finalRepoName += `/${cleanSubRepo}`
      }

      await image.tag({
        tag: `${tag}`,
        repo: `${cleanRegistry}/${finalRepoName}`,
      });

      const imgToPush = await docker.getImage(
        `${cleanRegistry}/${finalRepoName}:${tag}`
      );

      const stream = await imgToPush.push({
        tag,
        authconfig: {
          username: options.username,
          password: options.password,
          serveraddress: cleanRegistry,
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
