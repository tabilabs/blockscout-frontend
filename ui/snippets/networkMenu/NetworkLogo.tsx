import { Box, Image, useColorModeValue, Skeleton, useColorMode } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
}

const LogoFallback = ({ isCollapsed, isSmall }: { isCollapsed?: boolean; isSmall?: boolean }) => {
  const field = isSmall ? 'icon' : 'logo';
  const logoColor = useColorModeValue('blue.600', 'white');

  const display = isSmall ? {
    base: 'none',
    lg: isCollapsed === false ? 'none' : 'block',
    xl: isCollapsed ? 'block' : 'none',
  } : {
    base: 'block',
    lg: isCollapsed === false ? 'block' : 'none',
    xl: isCollapsed ? 'none' : 'block',
  };

  if (config.UI.sidebar[field].default) {
    return <Skeleton w="100%" borderRadius="sm" display={ display }/>;
  }

  return (
    <IconSvg
      name={ isSmall ? 'networks/icon-placeholder' : 'networks/logo-placeholder' }
      width="auto"
      height="100%"
      color={ logoColor }
      display={ display }
    />
  );
};

const NetworkLogo = ({ isCollapsed, onClick }: Props) => {

  const logoSrc = useColorModeValue(config.UI.sidebar.logo.default, config.UI.sidebar.logo.dark || config.UI.sidebar.logo.default);
  const iconSrc = useColorModeValue(config.UI.sidebar.icon.default, config.UI.sidebar.icon.dark || config.UI.sidebar.icon.default);
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const logoStyle = useColorModeValue({}, !config.UI.sidebar.logo.dark ? darkModeFilter : {});
  const iconStyle = useColorModeValue({}, !config.UI.sidebar.icon.dark ? darkModeFilter : {});
  const { colorMode } = useColorMode();
  return (
    <Box
      as="a"
      href={ route({ pathname: '/' }) }
      width={{ base: '180px', lg: isCollapsed === false ? '180px' : '30px', xl: isCollapsed ? '30px' : '180px' }}
      height={{ base: '40px', lg: isCollapsed === false ? '40px' : '30px', xl: isCollapsed ? '30px' : '40px' }}
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      aria-label="Link to main page"
    >
      { /* big logo */ }
      {/*<img*/}
      {/*  src={ isCollapsed ? '/static/icon-placeholder-1.svg' : colorMode === 'dark' ? '/static/logo-placeholder-black-1.svg' : '/static/logo-placeholder-white-1.svg' }*/}
      {/*/>*/}
      <Image
        w="auto"
        h="100%"
        src={ colorMode === 'dark' ? '/static/logo-placeholder-black-1.svg' : '/static/logo-placeholder-white-1.svg' }
        alt={ `${ config.chain.name } network logo` }
        // fallback={ <LogoFallback isCollapsed={ isCollapsed }/> }
        display={{ base: 'block', lg: isCollapsed === false ? 'block' : 'none', xl: isCollapsed ? 'none' : 'block' }}
        // style={ logoStyle }
      />
      {/*{ /* small logo */ }
      <Image
        w="auto"
        h="100%"
        src={ '/static/icon-placeholder-1.svg' }
        alt={ `${ config.chain.name } network logo` }
        // fallback={ <LogoFallback isCollapsed={ isCollapsed } isSmall/> }
        display={{ base: 'none', lg: isCollapsed === false ? 'none' : 'block', xl: isCollapsed ? 'block' : 'none' }}
        // style={ iconStyle }
      />
    </Box>
  );
};

export default React.memo(NetworkLogo);
