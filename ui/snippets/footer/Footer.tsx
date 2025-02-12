import type { GridProps, HTMLChakraProps } from '@chakra-ui/react';
import {
  Box,
  Grid,
  Flex,
  Text,
  Link,
  VStack,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { clsx as cx } from 'clsx';
import { css } from 'goober';
import React from 'react';

import type { CustomLinksGroup } from 'types/footerLinks';

import config from 'configs/app';
import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import useFetch from 'lib/hooks/useFetch';
import useIssueUrl from 'lib/hooks/useIssueUrl';
import { copy } from 'lib/html-entities';
import Skeleton from 'ui/shared/chakra/Skeleton';
import IconSvg from 'ui/shared/IconSvg';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import FooterLinkItem from './FooterLinkItem';
import IntTxsIndexingStatus from './IntTxsIndexingStatus';
import getApiVersionUrl from './utils/getApiVersionUrl';

const MAX_LINKS_COLUMNS = 4;

const FRONT_VERSION_URL = `https://github.com/blockscout/frontend/tree/${ config.UI.footer.frontendVersion }`;
const FRONT_COMMIT_URL = `https://github.com/blockscout/frontend/commit/${ config.UI.footer.frontendCommit }`;

const baseStyles = {
  flexRow: css`
    display: flex;
    flex-direction: row;
  `,

  categoryWrap: css`
    width: 160px;
    display: flex;
    flex-direction: column;
    @media (max-width: 520px) {
      width: auto;
      flex: 1;
    }
  `,

  categoryTitle: css`
    display: flex;
    height: 36px;
    flex-direction: column;
    align-items: flex-start;
    flex-shrink: 0;
    color: #000;
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px;
    margin-bottom: 12px;
  `,

  categoryItem: css`
    display: flex;
    padding-right: 38px;
    flex-direction: row;
    align-items: flex-start;
    align-self: stretch;
    color: #696969;
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 150% */
    margin-bottom: 6px;
    cursor: pointer;
    gap: 11px;
    &:hover {
      color: #d1102b;
    }
  `,

  communityIcon: css`
    width: 18px;
    height: 18px;
  `,
};

const Footer = () => {
  const { data: backendVersionData } = useApiQuery('config_backend_version', {
    queryOptions: {
      staleTime: Infinity,
    },
  });

  const openNewPage = (url: string) => {
    window.open(url, '_blank');
  };

  const { colorMode } = useColorMode();

  const isDark = colorMode === 'dark';

  const apiVersionUrl = getApiVersionUrl(backendVersionData?.backend_version);
  const issueUrl = useIssueUrl(backendVersionData?.backend_version);
  const logoColor = useColorModeValue('blue.600', 'white');

  const BLOCKSCOUT_LINKS = [
    {
      icon: 'edit' as const,
      iconSize: '16px',
      text: 'Submit an issue',
      url: issueUrl,
    },
    {
      icon: 'social/git' as const,
      iconSize: '18px',
      text: 'Contribute',
      url: 'https://github.com/blockscout/blockscout',
    },
    {
      icon: 'social/twitter' as const,
      iconSize: '18px',
      text: 'X (ex-Twitter)',
      url: 'https://www.twitter.com/blockscoutcom',
    },
    {
      icon: 'social/discord' as const,
      iconSize: '24px',
      text: 'Discord',
      url: 'https://discord.gg/blockscout',
    },
    {
      icon: 'brands/blockscout' as const,
      iconSize: '18px',
      text: 'All chains',
      url: 'https://www.blockscout.com/chains-and-projects',
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
      return (
        <Link href={ FRONT_VERSION_URL } target="_blank">
          { config.UI.footer.frontendVersion }
        </Link>
      );
    }

    if (config.UI.footer.frontendCommit) {
      return (
        <Link href={ FRONT_COMMIT_URL } target="_blank">
          { config.UI.footer.frontendCommit }
        </Link>
      );
    }

    return null;
  })();

  const fetch = useFetch();

  const { isPlaceholderData, data: linksData } = useQuery<
    unknown,
    ResourceError<unknown>,
    Array<CustomLinksGroup>
  >({
    queryKey: [ 'footer-links' ],
    queryFn: async() =>
      fetch(config.UI.footer.links || '', undefined, {
        resource: 'footer-links',
      }),
    enabled: Boolean(config.UI.footer.links),
    staleTime: Infinity,
    placeholderData: [],
  });

  const colNum = isPlaceholderData ?
    1 :
    Math.min(linksData?.length || Infinity, MAX_LINKS_COLUMNS) + 1;

  const renderNetworkInfo = React.useCallback(
    (gridArea?: GridProps['gridArea']) => {
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
    },
    [],
  );

  const renderProjectInfo = React.useCallback(
    (gridArea?: GridProps['gridArea']) => {
      return (
        <Box gridArea={ gridArea }>
          <Flex
            columnGap={ 2 }
            fontSize="xs"
            lineHeight={ 5 }
            alignItems="center"
            color="text"
          >
            <span>Made with</span>
            <Link
              href="https://www.blockscout.com"
              isExternal
              display="inline-flex"
              color={ logoColor }
              _hover={{ color: logoColor }}
            >
              <IconSvg
                name="networks/logo-placeholder"
                width="80px"
                height={ 4 }
              />
            </Link>
          </Flex>
          <Text mt={ 3 } fontSize="xs">
            Blockscout is a tool for inspecting and analyzing EVM based
            blockchains. Blockchain explorer for Ethereum Networks.
          </Text>
          <Box mt={ 6 } alignItems="start" fontSize="xs" lineHeight={ 5 }>
            { apiVersionUrl && (
              <Text>
                Backend:{ ' ' }
                <Link href={ apiVersionUrl } target="_blank">
                  { backendVersionData?.backend_version }
                </Link>
              </Text>
            ) }
            { frontendLink && <Text>Frontend: { frontendLink }</Text> }
            <Text>
              Copyright { copy } Blockscout Limited 2023-
              { new Date().getFullYear() }
            </Text>
          </Box>
        </Box>
      );
    },
    [
      apiVersionUrl,
      backendVersionData?.backend_version,
      frontendLink,
      logoColor,
    ],
  );

  const containerProps: HTMLChakraProps<'div'> = {
    as: 'footer',
    borderTopWidth: '1px',
    borderTopColor: 'solid',
  };

  const contentProps: GridProps = {
    px: {
      base: 4,
      lg: config.UI.navigation.layout === 'horizontal' ? 6 : 12,
      '2xl': 6,
    },
    py: { base: 4, lg: 8 },
    gridTemplateColumns: { base: '1fr', lg: 'minmax(auto, 470px) 1fr' },
    columnGap: { lg: '32px', xl: '100px' },
    maxW: `${ CONTENT_MAX_WIDTH }px`,
    m: '0 auto',
  };

  const renderRecaptcha = (gridArea?: GridProps['gridArea']) => {
    if (!config.services.reCaptchaV2.siteKey) {
      return <Box gridArea={ gridArea }/>;
    }

    return (
      <Box gridArea={ gridArea } fontSize="xs" lineHeight={ 5 } mt={ 6 } color="text">
        <span>This site is protected by reCAPTCHA and the Google </span>
        <Link href="https://policies.google.com/privacy" isExternal>
          Privacy Policy
        </Link>
        <span> and </span>
        <Link href="https://policies.google.com/terms" isExternal>
          Terms of Service
        </Link>
        <span> apply.</span>
      </Box>
    );
  };

  if (config.UI.footer.links) {
    return (
      <Box { ...containerProps }>
        <Grid { ...contentProps }>
          <div>
            { renderNetworkInfo() }
            { renderProjectInfo() }
            { renderRecaptcha() }
          </div>

          <Grid
            gap={{
              base: 6,
              lg: colNum === MAX_LINKS_COLUMNS + 1 ? 2 : 8,
              xl: 12,
            }}
            gridTemplateColumns={{
              base: 'repeat(auto-fill, 160px)',
              lg: `repeat(${ colNum }, 135px)`,
              xl: `repeat(${ colNum }, 160px)`,
            }}
            justifyContent={{ lg: 'flex-end' }}
            mt={{ base: 8, lg: 0 }}
          >
            { [
              { title: 'Blockscout', links: BLOCKSCOUT_LINKS },
              ...(linksData || []),
            ]
              .slice(0, colNum)
              .map((linkGroup) => (
                <Box key={ linkGroup.title }>
                  <Skeleton
                    fontWeight={ 500 }
                    mb={ 3 }
                    display="inline-block"
                    isLoaded={ !isPlaceholderData }
                  >
                    { linkGroup.title }
                  </Skeleton>
                  <VStack spacing={ 1 } alignItems="start">
                    { linkGroup.links.map((link) => (
                      <FooterLinkItem
                        { ...link }
                        key={ link.text }
                        isLoading={ isPlaceholderData }
                      />
                    )) }
                  </VStack>
                </Box>
              )) }
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box { ...containerProps }>
      <Grid
        { ...contentProps }
        gridTemplateAreas={{
          lg: `
          "network links-top"
          "info links-bottom"
          "recaptcha links-bottom"
        `,
        }}
      >
        { renderNetworkInfo({ lg: 'network' }) }
        { renderProjectInfo({ lg: 'info' }) }
        { renderRecaptcha({ lg: 'recaptcha' }) }

        <Flex
          gridArea={{ lg: 'links-bottom' }}
          flexDirection="row"
          justifyContent={{ lg: 'flex-end' }}
          // mb={{ base: 5, lg: 10 }}
          mt={{ base: 30, lg: 0 }}
          // _empty={{ display: 'none' }}
          fontSize={ 12 }
        >
          <div className={ cx(baseStyles.categoryWrap) }>
            <div
              className={ cx(baseStyles.categoryTitle) }
              style={ isDark ? { color: 'rgba(255, 255, 255, 0.92)' } : {} }
            >
              About
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('https://www.tabichain.com/') }
            >
              Home
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage('https://tabichain.gitbook.io/tabichain')
              }
            >
              About Tabi
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage('https://cdn.tabichain.com/Whitepaper1.0.pdf')
              }
            >
              Whitepaper
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage('https://tabichain.gitbook.io/tabi-or-captain-node')
              }
            >
              Captain Node
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage(
                  'https://tabichain.gitbook.io/tabichain/developer-guide/pvm',
                )
              }
            >
              Poly-VM
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('https://tabi.lol/') }
            >
              BLOG
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage('https://www.tabichain.com/terms-of-service.html')
              }
            >
              Terms of use
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage('https://www.tabichain.com/privacy-policy.html')
              }
            >
              Privacy Policy
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('mailto:Contact@tabi.lol') }
            >
              Contact Us
            </div>
          </div>
          <div className={ cx(baseStyles.categoryWrap) }>
            <div
              className={ cx(baseStyles.categoryTitle) }
              style={ isDark ? { color: 'rgba(255, 255, 255, 0.92)' } : {} }
            >
              Ecosystem
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('https://carnival.tabichain.com/') }
            >
              Explore Ecosystem
            </div>
            { /*<div className={cx(baseStyles.categoryItem)} style={isDark ? {color: '#718096'} : {}} onClick={() => openNewPage('https://github.com/tabilabs')}>*/ }
            { /*  Github*/ }
            { /*</div>*/ }
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage(
                  'https://docs.google.com/forms/d/1eYERwfT7yS_v_YMlL7sMXaQ8WtdQ4iS0C4BUbDhDh9o/viewform?edit_requested=true#responses',
                )
              }
            >
              Build
            </div>
          </div>
          <div className={ cx(baseStyles.categoryWrap) }>
            <div
              className={ cx(baseStyles.categoryTitle) }
              style={ isDark ? { color: 'rgba(255, 255, 255, 0.92)' } : {} }
            >
              Resources
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('https://linktr.ee/tabichain') }
            >
              Social media
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage(
                  'https://drive.google.com/drive/folders/15yIAEqaEM3OpFeBIJu30K-KSBtgC-03S',
                )
              }
            >
              Brand Assets
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage(
                  'https://star-cheetah-437.notion.site/Tabi-Job-Description-1571ec67d85680a980acd65fc1971d10',
                )
              }
            >
              Careers
            </div>
          </div>
          <div className={ cx(baseStyles.categoryWrap) }>
            <div
              className={ cx(baseStyles.categoryTitle) }
              style={ isDark ? { color: 'rgba(255, 255, 255, 0.92)' } : {} }
            >
              Developers
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('https://github.com/tabilabs') }
            >
              Github
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('https://carnival.tabichain.com/') }
            >
              Faucet
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('https://testnetv2.tabiscan.com/') }
            >
              Explore
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () =>
                openNewPage('https://tabichain.gitbook.io/tabichain')
              }
            >
              Docs
            </div>
            <div
              className={ cx(baseStyles.categoryItem) }
              style={ isDark ? { color: '#718096' } : {} }
              onClick={ () => openNewPage('https://blog.tabi.lol/article/40') }
            >
              Grants
            </div>
          </div>
          { /* <div className={ cx(baseStyles.categoryWrap) }>
          <div className={ cx(baseStyles.categoryTitle) } style={ isDark ? { color: 'rgba(255, 255, 255, 0.92)' } : {} }>
            Community
          </div>
          <div className={ cx(baseStyles.categoryItem) } style={ isDark ? { color: '#718096' } : {} } onClick={ () => openNewPage('https://twitter.com/Tabichain') }>
            <img src={ isDark ? '/static/twitter-dark.svg' : '/static/twitter-light.svg' } className={ cx(baseStyles.communityIcon) }/>Twitter
          </div>
          <div className={ cx(baseStyles.categoryItem) } style={ isDark ? { color: '#718096' } : {} } onClick={ () => openNewPage('https://discord.com/invite/tabichain') }>
            <img src={ isDark ? '/static/discord-dark.svg' : '/static/discord-light.svg' } className={ cx(baseStyles.communityIcon) }/>Discord
          </div>
          <div className={ cx(baseStyles.categoryItem) } style={ isDark ? { color: '#718096' } : {} } onClick={ () => openNewPage('https://blog.tabi.lol/#/') }>
            <img src={ isDark ? '/static/blog-dark.png' : '/static/blog-light.png' } className={ cx(baseStyles.communityIcon) }/>Blog
          </div>
        </div> */ }
        </Flex>

        { /* <Grid
          gridArea={{ lg: 'links-bottom' }}
          gap={1}
          gridTemplateColumns={{
            base: 'repeat(auto-fill, 160px)',
            lg: 'repeat(2, 160px)',
            xl: 'repeat(3, 160px)',
          }}
          gridTemplateRows={{
            base: 'auto',
            lg: 'repeat(3, auto)',
            xl: 'repeat(2, auto)',
          }}
          gridAutoFlow={{ base: 'row', lg: 'column' }}
          alignContent="start"
          justifyContent={{ lg: 'flex-end' }}
          mt={{ base: 8, lg: 0 }}
        >
          {BLOCKSCOUT_LINKS.map((link) => (
            <FooterLinkItem {...link} key={link.text} />
          ))}
        </Grid> */ }
      </Grid>
    </Box>
  );
};

export default React.memo(Footer);
