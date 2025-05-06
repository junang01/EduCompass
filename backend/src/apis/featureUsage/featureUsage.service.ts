import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureUsage } from './entities/featureUsage.entity';
import { Repository } from 'typeorm';
import { IFeatureUsageService } from './interfaces/featureUsage.interface';

@Injectable()
export class FeatureUsageService {
  constructor(
    @InjectRepository(FeatureUsage)
    private readonly featureUsageRepository: Repository<FeatureUsage>,
  ) {}

  async canUsage(input: IFeatureUsageService) {
    const localTime = new Date();
    const threeDay = 3 * 24 * 60 * 60 * 1000;
    console.log('제발 들어와라!');
    const FindUsageReturn = await this.findUsage(input);
    if (!FindUsageReturn) return;

    const { lastUse, ...result } = FindUsageReturn;
    const difUsage = localTime.getTime() - lastUse.getTime();

    if (difUsage < threeDay) {
      const canUsage = new Date(threeDay + lastUse.getTime());
      throw new ConflictException(`${canUsage.toLocaleString()}부터 사용 가능합니다.`);
    }
    return;
    // return this.featureUsageRepository.save({
    //   ...featureUsage,
    //   lastUse: localTime,
    // });
  }

  async saveUsage(input: IFeatureUsageService) {
    const nowTime = new Date();
    await this.featureUsageRepository.save({
      ...input,
      lastUse: nowTime,
    });
  }

  async findUsage({ userId, featureName }: IFeatureUsageService): Promise<FeatureUsage> {
    return await this.featureUsageRepository.findOne({ where: { userId, featureName } });
  }
}
