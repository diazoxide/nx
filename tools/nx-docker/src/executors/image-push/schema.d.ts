import { DockerOptionsContainer } from '../../common';

export interface ImagePushExecutorSchema extends DockerOptionsContainer {
  tag: string;
  tags: string[];
  hash: string;
  registry?: string;
  repository: string;
  username: string;
  password: string;
}
