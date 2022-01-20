import { ChangeProfilePicture } from '@/domain/use-cases';
import { HttpResponse, ok } from '@/application/helpers';
import { Controller } from './controller';
import {
  ValidationBuilder as Builder,
  Validator
} from '@/application/validation';

type HttpRequest = {
  file?: { buffer: Buffer; mimeType: string };
  userId: string;
};
type Model = { initials?: string; pictureUrl?: string };

export class SavePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const { initials, pictureUrl } = await this.changeProfilePicture({
      id: userId,
      file
    });
    return ok({ initials, pictureUrl });
  }

  override buildersValidators({ file }: HttpRequest): Validator[] {
    if (!file) return [];
    return [
      ...Builder.of({ value: file, fieldName: 'buffer' })
        .required()
        .image({
          allowed: ['jpg', 'png'],
          maxSizeInMb: 5
        })
        .build()
    ];
  }
}
