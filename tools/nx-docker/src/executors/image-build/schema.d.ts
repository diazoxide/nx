import { DockerOptionsContainer } from '../../common';

export interface ImageBuildExecutorSchema extends DockerOptionsContainer {
  dockerfile?: string;
  context: string;
  target?: string;
  tag?: string;
}
