import { EnvNameEnum } from 'src/enums/common.enum';

/**
 * ANCHOR Env Interface
 * @date 18/04/2025 - 10:30:08
 *
 * @export
 * @interface EnvInterface
 * @typedef {EnvInterface}
 */
export interface EnvInterface {
  ENV_NAME: EnvNameEnum;

  MONGODB_URI: string;

  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_AUTH_PASS: string;

  DIGITALOCEAN_SPACES_ACCESS_KEY_ID: string;
  DIGITALOCEAN_SPACES_SECRET_ACCESS_KEY: string;
  DIGITALOCEAN_SPACES_REGION: string;
  DIGITALOCEAN_SPACES_ENDPOINT: string;
  DIGITALOCEAN_SPACES_BUCKET: string;
  DIGITALOCEAN_SPACES_NAMESPACE: string;

  API_URL: string;
}
