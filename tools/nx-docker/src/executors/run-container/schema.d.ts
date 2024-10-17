import { DockerOptionsContainer } from '../../common';

export interface RunContainerExecutorSchema extends DockerOptionsContainer {
  dockerfile?: string;
  context: string;
  target?: string;
  containerName: string;
}
