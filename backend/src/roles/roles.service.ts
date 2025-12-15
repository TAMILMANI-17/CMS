import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument, UserRole } from './schemas/role.schema';
import { FeaturesService } from '../features/features.service';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
    private readonly featuresService: FeaturesService,
  ) {}

  async onModuleInit() {
    await this.initializeRoles();
  }

  private async initializeRoles() {
    const allFeatures = await this.featuresService.findAll();
    if (!allFeatures || allFeatures.length === 0) {
      // Features will be initialized by FeaturesService; roles will be initialized on next run
      return;
    }

    // Ensure deterministic order by name (feature_1..feature_10)
    const sortedFeatures = [...allFeatures].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const rolesConfig = [
      {
        name: UserRole.SUPER_ADMIN,
        description: 'Super Admin with all features',
        featureNames: sortedFeatures.map((f) => f.name), // All 10 features
      },
      {
        name: UserRole.ADMIN,
        description: 'Admin with first 8 features',
        featureNames: sortedFeatures.slice(0, 8).map((f) => f.name), // First 8 features
      },
      {
        name: UserRole.EMPLOYEE,
        description: 'Employee with first 4 features',
        featureNames: sortedFeatures.slice(0, 4).map((f) => f.name), // First 4 features
      },
      {
        name: UserRole.USER,
        description: 'User with only feature_1',
        featureNames: sortedFeatures.slice(0, 1).map((f) => f.name), // Only feature_1
      },
    ];

    for (const roleConfig of rolesConfig) {
      const featureIds = sortedFeatures
        .filter((f) => roleConfig.featureNames.includes(f.name))
        .map((f) => f._id);

      await this.roleModel
        .findOneAndUpdate(
          { name: roleConfig.name },
          {
            name: roleConfig.name,
            description: roleConfig.description,
            features: featureIds,
          },
          { upsert: true, new: true },
        )
        .exec();
    }
  }

  async findByName(name: UserRole): Promise<RoleDocument | null> {
    return this.roleModel.findOne({ name }).populate('features').exec();
  }

  async findAll(): Promise<RoleDocument[]> {
    return this.roleModel.find().populate('features').exec();
  }

  async getFeaturesByRole(roleName: UserRole): Promise<string[]> {
    const role = await this.findByName(roleName);
    if (!role || !role.features || role.features.length === 0) {
      return [];
    }
    
    // Handle both populated and unpopulated features
    const features = Array.isArray(role.features)
      ? role.features
      : [role.features];
    
    const featureNames: string[] = [];
    const unpopulatedIds: string[] = [];
    
    for (const f of features) {
      if (typeof f === 'object' && f !== null) {
        // If populated, it will have a 'name' property
        if ('name' in f && typeof f.name === 'string') {
          featureNames.push(f.name);
        } else if ('_id' in f) {
          // Collect ObjectIds to fetch in batch
          unpopulatedIds.push(f._id.toString());
        }
      }
    }
    
    // Fetch unpopulated features in batch
    if (unpopulatedIds.length > 0) {
      const fetchedFeatures = await this.featuresService.findByIds(unpopulatedIds);
      for (const feature of fetchedFeatures) {
        if (feature && feature.name) {
          featureNames.push(feature.name);
        }
      }
    }
    
    // Sort to ensure consistent order (feature_1, feature_2, etc.)
    return featureNames.sort((a, b) => a.localeCompare(b));
  }
}

