import * as dbConfig from './database-config.json';
import * as cacheConfig from './cache-config.json';
import * as apiConfig from './api-config.json';

export const baseConfig = {
  'name': 'nodeapi',
  'logo': 'https://via.placeholder.com/50',
  'poweredBy': 'node api',
  'secretKey': 'x-node-api-key',
  'secretKeyHash': 'KuQmvnxXEjR7KXwfucgerTf6YwZV5Amz5awwxf5PFgkpGrb3Jn',
  'secretKeyLength': 5,
  'getQueryLimit': 10,
  'passwordExpiryLength': 30,
  'defaultUserRole': 3, // should match on database `roles`
  'defaultLanguage': 1, // should match on database `languages`
  'defaultCountry': 169, // should match on database `countries`

  'defaultEmail': 'jnpl.onte@gmail.com',
  'mail': {
    'service': 'gmail',
    'username': '',
    'password': ''
  },

  'database': dbConfig,
  'cache': cacheConfig,
  'api': apiConfig
};
