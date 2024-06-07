import { Test, TestingModule } from '@nestjs/testing';
import { BridgesController } from './bridges.controller';

describe('BridgesController', () => {
  let controller: BridgesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BridgesController],
    }).compile();

    controller = module.get<BridgesController>(BridgesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
