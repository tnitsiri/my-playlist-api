import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyCacheService } from './spotify.cache.service';

describe('SpotifyCacheService', () => {
  let service: SpotifyCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyCacheService],
    }).compile();

    service = module.get<SpotifyCacheService>(SpotifyCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
