import { Box, Heading, Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import ChainIndicators from 'ui/home/indicators/ChainIndicators';
import LatestBlocks from 'ui/home/LatestBlocks';
import LatestZkEvmL2Batches from 'ui/home/LatestZkEvmL2Batches';
import Stats from 'ui/home/Stats';
import Transactions from 'ui/home/Transactions';
import AdBanner from 'ui/shared/ad/AdBanner';
import ProfileMenuDesktop from 'ui/snippets/profileMenu/ProfileMenuDesktop';
import SearchBar from 'ui/snippets/searchBar/SearchBar';
import WalletMenuDesktop from 'ui/snippets/walletMenu/WalletMenuDesktop';

const Home = () => {
  const { colorMode } = useColorMode();
  return (
    <Box as="main">
      <Box
        w="100%"
        // background={ config.UI.homepage.plate.background }
        backgroundImage={colorMode === 'dark' ? '/static/rect-banner-black.svg' : '/static/rect-banner-white.svg' }
        borderRadius="24px"
        padding={{ base: '24px', lg: '48px' }}
        minW={{ base: 'unset', lg: '900px' }}
        data-label="hero plate"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
        // backgroundSize="100% auto"
      >
        <Flex mb={{ base: 6, lg: 8 }} justifyContent="space-between" alignItems="center">
          <Heading
            as="h1"
            size={{ base: 'md', lg: 'xl' }}
            lineHeight={{ base: '32px', lg: '50px' }}
            fontWeight={ 600 }
            color={ colorMode === 'dark' ? '#FFF' : '#101112' }
          >
            { config.chain.name } explorer
          </Heading>
          <Box display={{ base: 'none', lg: 'flex' }}>
            { config.features.account.isEnabled && <ProfileMenuDesktop isHomePage/> }
            { config.features.blockchainInteraction.isEnabled && <WalletMenuDesktop isHomePage/> }
          </Box>
        </Flex>
        <SearchBar isHomepage/>
      </Box>
      <Stats/>
      <ChainIndicators/>
      <AdBanner mt={{ base: 6, lg: 8 }} mx="auto" display="flex" justifyContent="center"/>
      <Flex mt={ 8 } direction={{ base: 'column', lg: 'row' }} columnGap={ 12 } rowGap={ 8 }>
        { config.features.zkEvmRollup.isEnabled ? <LatestZkEvmL2Batches/> : <LatestBlocks/> }
        <Box flexGrow={ 1 }>
          <Transactions/>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
