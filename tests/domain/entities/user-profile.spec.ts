import { UserProfile } from '@/domain/entities';

describe('UserProfile', () => {
  let sut: UserProfile;

  beforeEach(() => {
    sut = new UserProfile('any_id');
  });

  it('should create with empty initials when picture url is provided', () => {
    sut.setPicture({
      pictureUrl: 'any_url',
      name: 'any_name'
    });
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    });
  });

  it('should create with empty initials when picture url is provided', () => {
    sut.setPicture({
      pictureUrl: 'any_url'
    });
    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    });
  });

  it('should create initials with first letter of first and last names', () => {
    sut.setPicture({
      name: 'thiago turim carvalho'
    });
    expect(sut).toEqual({
      id: 'any_id',
      initials: 'TC'
    });
  });

  it('should create initials with first two letters of first name', () => {
    sut.setPicture({
      name: 'thiago'
    });
    expect(sut).toEqual({
      id: 'any_id',
      initials: 'TH'
    });
  });

  it('should create initials with first letter', () => {
    sut.setPicture({
      name: 't'
    });
    expect(sut).toEqual({
      id: 'any_id',
      initials: 'T'
    });
  });

  it('should create with empty initials when name and pictureUrl ate not provider', () => {
    sut.setPicture({});
    expect(sut).toEqual({
      id: 'any_id'
    });
  });
});
