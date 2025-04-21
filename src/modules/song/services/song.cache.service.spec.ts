import { Test, TestingModule } from '@nestjs/testing';
import { SongCacheService } from './song.cache.service';

describe('SongCacheService', () => {
  let service: SongCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongCacheService],
    }).compile();

    service = module.get<SongCacheService>(SongCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
