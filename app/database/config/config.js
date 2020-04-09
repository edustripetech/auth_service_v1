export const development = {
  use_env_variable: 'DB_URL',
  dialect: 'postgres',
  logging: false,
};

export const test = {
  use_env_variable: 'DB_URL_TEST',
  dialect: 'postgres',
  logging: false,
};

export const production = {
  use_env_variable: 'DB_URL',
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: true,
  },
};
