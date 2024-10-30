import { DockerOptionsContainer } from '../../common';

export interface ImagePushExecutorSchema extends DockerOptionsContainer {
  tagToPush: string;
  remoteTag: string | string[];
  registry?: string;
  repository: string;
  subRepository?: string;
  username?: string;
  password?: string;
}
