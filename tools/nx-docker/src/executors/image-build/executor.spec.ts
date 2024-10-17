import runExecutor from './executor';
import { PassThrough } from 'stream';
import * as dockerode from 'dockerode';

const mockDocker = {
  buildImage: jest.fn().mockResolvedValue(new PassThrough()),
  modem: {
    followProgress: jest.fn((stream, onFinished) =>
      onFinished(null, 'success')
    ),
  },
};

jest.mock('dockerode', () => {
  return jest.fn().mockImplementation(() => mockDocker);
});

describe('ImageBuild Executor', () => {
  beforeEach(() => {
    (dockerode as unknown as jest.Mock).mockImplementation(() => mockDocker);
  });

  it('should build the image successfully', async () => {
    const options = {
      context: './context',
      dockerfile: './Dockerfile',
      target: 'target',
      tag: 'tag',
      docker: {},
    };

    const result = await runExecutor(options, {
      root: '/root',
      cwd: '.',
      isVerbose: true,
    });

    expect(result).toEqual({ success: true });
    expect(mockDocker.buildImage).toHaveBeenCalledWith(
      { context: options.context, src: [options.dockerfile] },
      { target: options.target, t: options.tag }
    );
    expect(mockDocker.modem.followProgress).toHaveBeenCalled();
  });
});
