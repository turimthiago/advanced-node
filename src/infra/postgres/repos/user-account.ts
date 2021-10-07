import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/repos';
import { getRepository } from 'typeorm';
import { PgUser } from '@/infra/postgres/entities';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;
type SaveResult = SaveFacebookAccountRepository.Result;

export class PgUserAccountRepository
  implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
  private readonly pgUserRepository = getRepository(PgUser);

  async load({ email }: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepository.findOne({ email });
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      };
    }
  }

  async saveWithFacebook({
    id,
    name,
    email,
    facebookId
  }: SaveParams): Promise<SaveResult> {
    let resultId: string;
    if (id === undefined) {
      const pgUser = await this.pgUserRepository.save({
        email,
        name,
        facebookId
      });
      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await this.pgUserRepository.update(
        { id: parseInt(id) },
        { name, facebookId }
      );
    }
    return { id: resultId };
  }
}
