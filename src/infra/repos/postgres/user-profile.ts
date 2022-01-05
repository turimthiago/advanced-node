import { SaveUserPicture } from '@/domain/contracts/repos';
import { getRepository } from 'typeorm';
import { PgUser } from '@/infra/repos/postgres/entities';

export class PgUserProfileRepository implements SaveUserPicture {
  async savePicture({
    id,
    pictureUrl,
    initials
  }: SaveUserPicture.Input): Promise<void> {
    const pgUserRepository = getRepository(PgUser);
    await pgUserRepository.update(
      { id: parseInt(id) },
      { pictureUrl, initials }
    );
  }
}
