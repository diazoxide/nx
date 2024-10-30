import { DockerOptionsContainer } from '../../common';

export interface ImagePushExecutorSchema extends DockerOptionsContainer {
  tagToPush: string;
  remoteTag: string | string[];
  registry?: string;
  repository: string;
  username: string;
  password: string;
}
