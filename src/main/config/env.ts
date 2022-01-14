export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '603785787726498',
    clientSecret:
      process.env.CLIENT_SECRET ?? 'aa248333858efe057f55e0f9875d202d'
  },
  port: process.env.PORT ?? '8080',
  jwtSecret: process.env.JWT_SECRET ?? 's3cr3t!',
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? '',
    secret: process.env.AWS_S3_SECRET ?? '',
    bucket: process.env.AWS_S3_BUCKET ?? ''
  }
};
