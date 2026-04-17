import { AppDataSource } from '../database';
import { Profile } from '../entities/Profile';

export class ProfileRepository {
  private repository = AppDataSource.getRepository(Profile);

  /**
   * Find a profile by ID
   */
  async findById(id: string): Promise<Profile | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * Find a profile by name (case-insensitive)
   */
  async findByName(name: string): Promise<Profile | null> {
    return this.repository.findOne({
      where: { name_lower: name.toLowerCase() },
    });
  }

  /**
   * Find all profiles with optional filters
   */
  async findAll(filters?: {
    gender?: string;
    country_id?: string;
    age_group?: string;
  }): Promise<Profile[]> {
    let query = this.repository.createQueryBuilder('profile');

    if (filters) {
      if (filters.gender) {
        query = query.where('LOWER(profile.gender) = LOWER(:gender)', {
          gender: filters.gender,
        });
      }
      if (filters.country_id) {
        query = query.andWhere('LOWER(profile.country_id) = LOWER(:country_id)', {
          country_id: filters.country_id,
        });
      }
      if (filters.age_group) {
        query = query.andWhere('LOWER(profile.age_group) = LOWER(:age_group)', {
          age_group: filters.age_group,
        });
      }
    }

    return query.orderBy('profile.created_at', 'DESC').getMany();
  }

  /**
   * Create a new profile
   */
  async create(profile: Partial<Profile>): Promise<Profile> {
    const newProfile = this.repository.create({
      ...profile,
      name_lower: (profile.name || '').toLowerCase(),
    });
    return this.repository.save(newProfile);
  }

  /**
   * Delete a profile by ID
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.delete({ id });
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * Check if profile exists by name
   */
  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { name_lower: name.toLowerCase() },
    });
    return count > 0;
  }

  /**
   * Count total profiles
   */
  async count(): Promise<number> {
    return this.repository.count();
  }
}

// Export singleton instance
export const profileRepository = new ProfileRepository();
