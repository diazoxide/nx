import { DockerOptionsContainer } from '../../common';
import { ContainerCreateOptions } from 'dockerode';

export interface RunContainerExecutorSchema
  extends DockerOptionsContainer,
    ContainerCreateOptions {
  image: string;
}
