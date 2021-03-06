import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos';
import { PgUser } from '@/infra/repos/postgres/entities';
import { PgRepository } from '@/infra/repos/postgres/repository';

type LoadParams = LoadUserAccount.Input;
type LoadResult = LoadUserAccount.Output;
type SaveParams = SaveFacebookAccount.Params;
type SaveResult = SaveFacebookAccount.Result;

export class PgUserAccountRepository
  extends PgRepository
  implements LoadUserAccount, SaveFacebookAccount
{
  async load({ email }: LoadParams): Promise<LoadResult> {
    const pgUserRepository = this.getRepository(PgUser);
    const pgUser = await pgUserRepository.findOne({ email });
    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name
      };
    }
  }

  async saveWithFacebook({
    id,
    name,
    email,
    facebookId
  }: SaveParams): Promise<SaveResult> {
    const pgUserRepository = this.getRepository(PgUser);
    let resultId: string;
    if (id === undefined) {
      const pgUser = await pgUserRepository.save({
        email,
        name,
        facebookId
      });
      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await pgUserRepository.update({ id: parseInt(id) }, { name, facebookId });
    }
    return { id: resultId };
  }
}
