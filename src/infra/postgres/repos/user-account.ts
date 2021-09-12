import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository
} from '@/data/repos';
import { getRepository } from 'typeorm';
import { PgUser } from '@/infra/postgres/entities';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SaveParams = SaveFacebookAccountRepository.Params;

export class PgUserAccountRepository implements LoadUserAccountRepository {
  private readonly pgUserRepository = getRepository(PgUser);

  async load(params: LoadParams): Promise<LoadResult> {
    const pgUser = await this.pgUserRepository.findOne({ email: params.email });
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      };
    }
  }

  async saveWithFacebook(params: SaveParams): Promise<void> {
    if (params.id === undefined) {
      await this.pgUserRepository.save({
        email: params.email,
        name: params.name,
        facebookId: params.facebookId
      });
    } else {
      await this.pgUserRepository.update(
        { id: parseInt(params.id) },
        { name: params.name, facebookId: params.facebookId }
      );
    }
  }
}
