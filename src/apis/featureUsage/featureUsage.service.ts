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

  async canUsage(input: IFeatureUsageService): Promise<FeatureUsage | null> {
    const localTime = new Date();
    const threeDay = 3 * 24 * 60 * 60 * 1000;
    console.log('제발 들어와라!');
    const findUsageReturn = await this.findUsage(input);
    if (!findUsageReturn) return;

    const { lastUse } = findUsageReturn;
    const difUsage = localTime.getTime() - lastUse.getTime();

    if (difUsage < threeDay) {
      const canUsage = new Date(threeDay + lastUse.getTime());
      throw new ConflictException(`${canUsage.toLocaleString()}부터 사용 가능합니다.`);
    }
    return findUsageReturn;
    // return this.featureUsageRepository.save({
    //   ...featureUsage,
    //   lastUse: localTime,
    // });
  }

  async saveUsage(saveFeatureUsageInput: IFeatureUsageService, findUsageReturn?: FeatureUsage | null) {
    const nowTime = new Date();
    if (findUsageReturn) {
      await this.featureUsageRepository.update(
        { userId: saveFeatureUsageInput.userId, featureName: saveFeatureUsageInput.featureName }, //
        { lastUse: nowTime },
      );
    } else {
      await this.featureUsageRepository.insert({
        userId: saveFeatureUsageInput.userId,
        featureName: saveFeatureUsageInput.featureName,
        lastUse: nowTime,
      });
    }
  }

  async findUsage({ userId, featureName }: IFeatureUsageService): Promise<FeatureUsage> {
    return await this.featureUsageRepository.findOne({ where: { userId, featureName } });
  }
}
