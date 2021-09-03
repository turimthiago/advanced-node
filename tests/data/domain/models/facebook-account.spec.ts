import { FacebookAccount } from '@/domain/models';

describe('FacebookAccount', () => {
  const facebookData = { name: 'any_facebook_name', email: 'any_fb_email', facebookId: 'any_fb_id' };

  it('should create with facebook data only', () => {
    const sut = new FacebookAccount(facebookData);
    expect(sut).toEqual({ name: 'any_facebook_name', email: 'any_fb_email', facebookId: 'any_fb_id' });
  });

  it('should update name if its empty', () => {
    const sut = new FacebookAccount(facebookData, { id: 'any_id' });
    expect(sut).toEqual({ id: 'any_id', name: 'any_facebook_name', email: 'any_fb_email', facebookId: 'any_fb_id' });
  });

  it('should not update name if its not empty', () => {
    const sut = new FacebookAccount(facebookData, { id: 'any_id', name: 'any_name' });
    expect(sut).toEqual({ id: 'any_id', name: 'any_name', email: 'any_fb_email', facebookId: 'any_fb_id' });
  });
});
