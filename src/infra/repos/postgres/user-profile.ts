import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos';
import { PgUser } from '@/infra/repos/postgres/entities';
import { PgRepository } from '@/infra/repos/postgres/repository';

export class PgUserProfileRepository
  extends PgRepository
  implements SaveUserPicture
{
  async savePicture({
    id,
    pictureUrl,
    initials
  }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepository = this.getRepository(PgUser);
    await pgUserRepository.update(
      { id: parseInt(id) },
      { pictureUrl, initials }
    );
  }

  async load({ id }: LoadUserProfile.Input): Promise<LoadUserProfile.Output> {
    const pgUserRepository = this.getRepository(PgUser);
    const pgUser = await pgUserRepository.findOne({ id: parseInt(id) });
    if (pgUser) return { name: pgUser.name ?? undefined };
  }
}
