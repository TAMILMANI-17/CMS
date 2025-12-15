import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feature, FeatureDocument } from './schemas/feature.schema';

@Injectable()
export class FeaturesService implements OnModuleInit {
  constructor(
    @InjectModel(Feature.name)
    private readonly featureModel: Model<FeatureDocument>,
  ) {}

  async onModuleInit() {
    await this.initializeFeatures();
  }

  private async initializeFeatures() {
    const featureCount = await this.featureModel.countDocuments();
    if (featureCount === 0) {
      const features = [];
      for (let i = 1; i <= 10; i++) {
        features.push({
          name: `feature_${i}`,
          description: `Feature ${i} description`,
        });
      }
      await this.featureModel.insertMany(features);
    }
  }

  async findAll(): Promise<FeatureDocument[]> {
    return this.featureModel.find().exec();
  }

  async findByName(name: string): Promise<FeatureDocument | null> {
    return this.featureModel.findOne({ name }).exec();
  }

  async findByIds(ids: string[]): Promise<FeatureDocument[]> {
    return this.featureModel.find({ _id: { $in: ids } }).exec();
  }

  async findByNames(names: string[]): Promise<FeatureDocument[]> {
    return this.featureModel.find({ name: { $in: names } }).exec();
  }
}

