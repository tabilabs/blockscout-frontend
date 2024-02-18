import type { GridProps } from '@chakra-ui/react';
import { Box, Grid, Flex, Text, Link, VStack, Skeleton, useColorMode } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import useIssueUrl from 'lib/hooks/useIssueUrl';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';
import getApiVersionUrl from './utils/getApiVersionUrl';
import { clsx as cx } from 'clsx'
import { css } from 'goober'
import useToast from 'lib/hooks/useToast';

const MAX_LINKS_COLUMNS = 4;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.UI.footer.frontendVersion }`;
const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${ config.UI.footer.frontendCommit }`;

const Footer = () => {
  const toast = useToast();
  const { data: backendVersionData } = useApiQuery('config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
    },
  });
  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const BLOCKSCOUT_LINKS = [
    {
      icon: 'edit' as const,
      iconSize: '16px',
      text: 'Submit an issue',
      url: issueUrl,
    },
    {
      icon: 'social/canny' as const,
      iconSize: '20px',
      text: 'Feature request',
      url: 'https://blockscout.canny.io/feature-requests',
    },
    {
      icon: 'social/git' as const,
      iconSize: '18px',
      text: 'Contribute',
      url: 'https://github.com/blockscout/blockscout',
    },
    {
      icon: 'social/tweet' as const,
      iconSize: '18px',
      text: 'Twitter',
      url: 'https://www.twitter.com/blockscoutcom',
    },
    {
      icon: 'social/discord' as const,
      iconSize: '24px',
      text: 'Discord',
      url: 'https://discord.gg/blockscout',
    },
    {
      icon: 'discussions' as const,
      iconSize: '20px',
      text: 'Discussions',
      url: 'https://github.com/orgs/blockscout/discussions',
    },
    {
      icon: 'donate' as const,
      iconSize: '20px',
      text: 'Donate',
      url: 'https://github.com/sponsors/blockscout',
    },
  ];

  const frontendLink = (() => {
    if (config.UI.footer.frontendVersion) {
      return <Link href={ FRONT_VERSION_URL } target="_blank">{ config.UI.footer.frontendVersion }</Link>;
    }

    if (config.UI.footer.frontendCommit) {
      return <Link href={ FRONT_COMMIT_URL } target="_blank">{ config.UI.footer.frontendCommit }</Link>;
    }

    return null;
  })();

  const isDark = () => {
    const { colorMode } = useColorMode();
    return colorMode === 'dark';
  }

  const openNewPage = (url: string) => {
    window.open(url, '_blank');
  };

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<unknown, ResourceError<unknown>, Array<CustomLinksGroup>>({
    queryKey: [ 'footer-links' ],
    queryFn: async() => fetch(config.UI.footer.links || '', undefined, { resource: 'footer-links' }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ? 1 : Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Flex
        gridArea={ gridArea }
        flexWrap="wrap"
        columnGap={ 8 }
        rowGap={ 6 }
        mb={{ base: 5, lg: 10 }}
        _empty={{ display: 'none' }}
      >
        { !config.UI.indexingAlert.intTxs.isHidden && <IntTxsIndexingStatus/> }
        <NetworkAddToWallet/>
      </Flex>
    );
  }, []);

  const addTabiChain = () => {
    if (typeof window.ethereum !== 'undefined') {
      const ethereum = window.ethereum;

      const bscNetwork = {
        chainId: '0x263d',
        chainName: 'Tabi Testnet',
        nativeCurrency: {
          name: 'Tabi Testnet',
          symbol: 'TABI',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.testnet.tabichain.com'], // BSC节点的RPC URL
        blockExplorerUrls: ['https://testnet.tabiscan.com/'], // 区块浏览器的URL
      };

      // 请求用户授权添加新的网络
      ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [bscNetwork],
        })
        .then(() => {
          toast({
            position: 'top-right',
            title: 'Success',
            description: 'Added successfully',
            colorScheme: 'green',
            status: 'success',
            variant: 'subtle',
            isClosable: true,
            icon: null,
          });
        })
        .catch((error) => console.error('add fail: ', error));
    } else {
      toast({
        position: 'top-right',
        title: 'Error',
        description: 'Please install the Metamask plugin',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
    }
  }

  const renderProjectInfo = React.useCallback((gridArea?: GridProps['gridArea']) => {
    return (
      <Box gridArea={ gridArea }>
        <div
          className={cx(
            css`
            color: #2B6CB0;
            font-family: Inter;
            font-size: 14px;
            font-style: normal;
            font-weight: 600;
            line-height: 18px; /* 128.571% */
            display: flex;
            padding: 0px 12px;
            align-items: center;
            border-radius: 8px;
            border: 2px solid #2B6CB0;
            cursor: pointer;
            width: 180px;
            height: 32px;
            marginBottom: 30px;
            &:hover {
              opacity: 0.6;
            }
          `,
          )}
          onClick={addTabiChain}
        >
          <img src={'/static/metamask-icon.svg'} style={{width: 32, height: 32}}/>
          Add Tabi testnet
        </div>
        <Link fontSize="xs" href="https://www.blockscout.com">blockscout.com</Link>
        <Text mt={ 3 } fontSize="xs">
          Blockscout is a tool for inspecting and analyzing EVM based blockchains. Blockchain explorer for Ethereum Networks.
        </Text>
        <VStack spacing={ 1 } mt={ 6 } alignItems="start">
          { apiVersionUrl && (
            <Text fontSize="xs">
              Backend: <Link href={ apiVersionUrl } target="_blank">{ backendVersionData?.backend_version }</Link>
            </Text>
          ) }
          { frontendLink && (
            <Text fontSize="xs">
              Frontend: { frontendLink }
            </Text>
          ) }
        </VStack>
      </Box>
    );
  }, [ apiVersionUrl, backendVersionData?.backend_version, frontendLink ]);

  const containerProps: GridProps = {
    as: 'footer',
    px: { base: 4, lg: 12 },
    py: { base: 4, lg: 9 },
    borderTop: '1px solid',
    borderColor: 'divider',
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
  };

  if (config.UI.footer.links) {
    // return (
    //   <Grid { ...containerProps }>
    //     <div>
    //       { renderNetworkInfo() }
    //       { renderProjectInfo() }
    //     </div>
    //
    //     <Grid
    //       gap={{ base: 6, lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8, xl: 12 }}
    //       gridTemplateColumns={{
    //         base: 'repeat(auto-fill, 160px)',
    //         lg: `repeat(${ colNum }, 135px)`,
    //         xl: `repeat(${ colNum }, 160px)`,
    //       }}
    //       justifyContent={{ lg: 'flex-end' }}
    //       mt={{ base: 8, lg: 0 }}
    //     >
    //       {
    //         ([
    //           { title: 'Blockscout', links: BLOCKSCOUT_LINKS },
    //           ...(linksData || []),
    //         ])
    //           .slice(0, colNum)
    //           .map(linkGroup => (
    //             <Box key={ linkGroup.title }>
    //               <Skeleton fontWeight={ 500 } mb={ 3 } display="inline-block" isLoaded={ !isPlaceholderData }>{ linkGroup.title }</Skeleton>
    //               <VStack spacing={ 1 } alignItems="start">
    //                 { linkGroup.links.map(link => <FooterLinkItem { ...link } key={ link.text } isLoading={ isPlaceholderData }/>) }
    //               </VStack>
    //             </Box>
    //           ))
    //       }
    //     </Grid>
    //   </Grid>
    // );
  }

  return (
    <Grid
      { ...containerProps }
      gridTemplateAreas={{
        lg: `
          "network links-top"
          "info links-bottom"
        `,
      }}
    >

      { renderNetworkInfo({ lg: 'network' }) }
      { renderProjectInfo({ lg: 'info' }) }

      <Flex
        gridArea={{ lg: 'links-bottom' }}
        flexDirection={'row'}
        justifyContent={{lg: 'flex-end'}}
        // mb={{ base: 5, lg: 10 }}
        // _empty={{ display: 'none' }}
      >
        <div className={cx(baseStyles.flexColumn)}>
          <div className={cx(baseStyles.categoryTitle)} style={isDark() ? {color: 'rgba(255, 255, 255, 0.92)'} : {}}>
            Tabi
          </div>
          <div className={cx(baseStyles.categoryItem)} style={isDark() ? {color: '#718096'} : {}} onClick={() => openNewPage('https://tabichain.com/')}>
            Home
          </div>
          <div className={cx(baseStyles.categoryItem)} style={isDark() ? {color: '#718096'} : {}} onClick={() => openNewPage('https://tabi.lol/')}>
            Tabi Voyage
          </div>
        </div>
        <div className={cx(baseStyles.flexColumn)}>
          <div className={cx(baseStyles.categoryTitle)} style={isDark() ? {color: 'rgba(255, 255, 255, 0.92)'} : {}}>
            Developers
          </div>
          <div className={cx(baseStyles.categoryItem)} style={isDark() ? {color: '#718096'} : {}} onClick={() => openNewPage('https://docs.tabichain.com/')}>
            Docs
          </div>
          <div className={cx(baseStyles.categoryItem)} style={isDark() ? {color: '#718096'} : {}} onClick={() => openNewPage('https://github.com/tabilabs')}>
            Github
          </div>
          <div className={cx(baseStyles.categoryItem)} style={isDark() ? {color: '#718096'} : {}} onClick={() => openNewPage('https://faucet.testnet.tabichain.com/')}>
            Faucet
          </div>
        </div>
        <div className={cx(baseStyles.flexColumn)}>
          <div className={cx(baseStyles.categoryTitle)} style={isDark() ? {color: 'rgba(255, 255, 255, 0.92)'} : {}}>
            Community
          </div>
          <div className={cx(baseStyles.categoryItem)} style={isDark() ? {color: '#718096'} : {}} onClick={() => openNewPage('https://twitter.com/Tabi_NFT')}>
            <img src={isDark() ? '/static/twitter-dark.svg' : '/static/twitter-light.svg'} className={cx(baseStyles.communityIcon)}/>Twitter
          </div>
          <div className={cx(baseStyles.categoryItem)} style={isDark() ? {color: '#718096'} : {}} onClick={() => openNewPage('https://discord.com/invite/tabinft')}>
            <img src={isDark() ? '/static/discord-dark.svg' : '/static/discord-light.svg'} className={cx(baseStyles.communityIcon)}/>Discord
          </div>
          <div className={cx(baseStyles.categoryItem)} style={isDark() ? {color: '#718096'} : {}} onClick={() => openNewPage('https://blog.tabi.lol/#/')}>
            <img src={isDark() ? '/static/blog-dark.svg' : '/static/blog-light.svg'} className={cx(baseStyles.communityIcon)}/>Blog
          </div>
        </div>
      </Flex>

      {/*<div className={cx(baseStyles.flexRow)} style={{gridArea: 'links-bottom'}}>*/}


      {/*</div>*/}
      {/*<Grid*/}
      {/*  gridArea={{ lg: 'links-bottom' }}*/}
      {/*  gap={ 1 }*/}
      {/*  gridTemplateColumns={{*/}
      {/*    base: 'repeat(auto-fill, 160px)',*/}
      {/*    lg: 'repeat(3, 160px)',*/}
      {/*    xl: 'repeat(4, 160px)',*/}
      {/*  }}*/}
      {/*  gridTemplateRows={{*/}
      {/*    base: 'auto',*/}
      {/*    lg: 'repeat(3, auto)',*/}
      {/*    xl: 'repeat(2, auto)',*/}
      {/*  }}*/}
      {/*  gridAutoFlow={{ base: 'row', lg: 'column' }}*/}
      {/*  alignContent="start"*/}
      {/*  justifyContent={{ lg: 'flex-end' }}*/}
      {/*  mt={{ base: 8, lg: 0 }}*/}
      {/*>*/}
      {/*  { BLOCKSCOUT_LINKS.map(link => <FooterLinkItem { ...link } key={ link.text }/>) }*/}
      {/*</Grid>*/}
    </Grid>
  );
};

const baseStyles = {
  flexRow: css`
    display: flex;
    flex-direction: row;
  `,

  flexColumn: css`
    display: flex;
    flex-direction: column;
  `,

  categoryTitle: css`
    display: flex;
    width: 160px;
    height: 36px;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    color: #1A202C;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
  `,

  categoryItem: css`
    display: flex;
    padding-right: 38px;
    flex-direction: row;
    align-items: flex-start;
    align-self: stretch;
    color: #4A5568;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 150% */
    height: 32px;
    cursor: pointer;
    gap: 11px;
    &:hover {
      text-decoration: underline;
    }
  `,

  communityIcon: css`
    width: 18px;
    height: 18px;
  `,
}
export default React.memo(Footer);
