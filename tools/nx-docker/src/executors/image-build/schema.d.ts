import { DockerOptionsContainer } from '../../common';
import { ImageBuildOptions } from 'dockerode';

export interface ImageBuildExecutorSchema
  extends DockerOptionsContainer,
    ImageBuildOptions {
  context?: string;
  src?: string[];
}
