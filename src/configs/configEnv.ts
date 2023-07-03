import dotenv from 'dotenv';

dotenv.config({});

class Config {
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public SERVER_PORT: string | undefined;
  public DATABASE_URL: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public SALT_ROUND: string | undefined;
  public JWT_TOKEN: string | undefined;
  public BASE_PATH: string | undefined;
  public MONGO_URI: undefined;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV;
    this.CLIENT_URL = process.env.CLIENT_URL;
    this.SERVER_PORT = process.env.SERVER_PORT;
    this.DATABASE_URL = process.env.MONGO_URI || process.env.DATABASE_URL;
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
    this.SALT_ROUND = process.env.SALT_ROUND;
    this.JWT_TOKEN = process.env.JWT_TOKEN;
    this.BASE_PATH = process.env.BASE_PATH;
  }

  public validateConfigEnv(): void {
    console.log(this);
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined`);
      }
    }
  }
}

export const config: Config = new Config();
