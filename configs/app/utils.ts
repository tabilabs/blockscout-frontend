import isBrowser from 'lib/isBrowser';
import * as regexp from 'lib/regexp';

export const replaceQuotes = (value: string | undefined) => value?.replaceAll('\'', '"');

if (isBrowser()) {
  window.__envs = {
    NEXT_PUBLIC_GIT_TAG: 'v1.21.1',
    NEXT_PUBLIC_API_HOST: 'testnet-api.tabiscan.com',
    NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: 'wss',
    NEXT_PUBLIC_GIT_COMMIT_SHA: '2500839f',
    NEXT_PUBLIC_VISUALIZE_API_HOST: 'http://testnet-api.tabiscan.com:8081',
    NEXT_PUBLIC_APP_HOST: 'testnet.tabiscan.com',
    NEXT_PUBLIC_APP_PORT: '3000',
    NEXT_PUBLIC_APP_INSTANCE: 'testnet.tabiscan.com',
    NEXT_PUBLIC_API_PROTOCOL: 'https',
    NEXT_PUBLIC_APP_ENV: 'development',
    // NEXT_PUBLIC_STATS_API_HOST: 'https://testnet-api.tabiscan.com',
    NEXT_PUBLIC_API_PORT: '443',
    NEXT_PUBLIC_NETWORK_ID: '9789',
    NEXT_PUBLIC_NETWORK_NAME: 'Tabi Testnet',
    NEXT_PUBLIC_NETWORK_SHORT_NAME: 'Tabi',
    NEXT_PUBLIC_NETWORK_CURRENCY_NAME: 'Tabi',
    NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL: 'TABI',
    NEXT_PUBLIC_NETWORK_GOVERNANCE_TOKEN_SYMBOL: 'TABI',
    NEXT_PUBLIC_NETWORK_RPC_URL: 'https://rpc.testnet.tabichain.com',
    NEXT_PUBLIC_IS_TESTNET: 'true'
  };
}

export const getEnvValue = (envName: string) => {
  // eslint-disable-next-line no-restricted-properties
  const envs = isBrowser() ? window.__envs : process.env;

  if (isBrowser() && envs.NEXT_PUBLIC_APP_INSTANCE === 'pw') {
    const storageValue = localStorage.getItem(envName);

    if (typeof storageValue === 'string') {
      return storageValue;
    }
  }

  return replaceQuotes(envs[envName]);
};

export const parseEnvJson = <DataType>(env: string | undefined): DataType | null => {
  try {
    return JSON.parse(env || 'null') as DataType | null;
  } catch (error) {
    return null;
  }
};

export const getExternalAssetFilePath = (envName: string) => {
  const parsedValue = getEnvValue(envName);

  if (!parsedValue) {
    return;
  }

  return buildExternalAssetFilePath(envName, parsedValue);
};

export const buildExternalAssetFilePath = (name: string, value: string) => {
  try {
    const fileName = name.replace(/^NEXT_PUBLIC_/, '').replace(/_URL$/, '').toLowerCase();
    const url = new URL(value);
    const fileExtension = url.pathname.match(regexp.FILE_EXTENSION)?.[1];
    return `/assets/${ fileName }.${ fileExtension }`;
  } catch (error) {
    return;
  }
};
