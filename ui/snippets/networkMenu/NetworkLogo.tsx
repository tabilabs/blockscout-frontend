import { Box, Image, useColorModeValue, chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import Skeleton from 'ui/shared/chakra/Skeleton';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  className?: string;
}

const LogoFallback = ({
  isCollapsed,
  isSmall,
}: {
  isCollapsed?: boolean;
  isSmall?: boolean;
}) => {
  const field = isSmall ? 'icon' : 'logo';
  const logoColor = useColorModeValue('blue.600', 'white');

  const display = isSmall ?
    {
      base: 'none',
      lg: isCollapsed === false ? 'none' : 'block',
      xl: isCollapsed ? 'block' : 'none',
    } :
    {
      base: 'block',
      lg: isCollapsed === false ? 'block' : 'none',
      xl: isCollapsed ? 'none' : 'block',
    };

  if (config.UI.navigation[field].default) {
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

const NetworkLogo = ({ isCollapsed, onClick, className }: Props) => {
  // const logoSrc = useColorModeValue(
  //   config.UI.navigation.logo.default,
  //   config.UI.navigation.logo.dark || config.UI.navigation.logo.default
  // );
  // const iconSrc = useColorModeValue(
  //   config.UI.navigation.icon.default,
  //   config.UI.navigation.icon.dark || config.UI.navigation.icon.default
  // );
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const logoStyle = useColorModeValue(
    {},
    !config.UI.navigation.logo.dark ? darkModeFilter : {},
  );
  const iconStyle = useColorModeValue(
    {},
    !config.UI.navigation.icon.dark ? darkModeFilter : {},
  );

  return (
    <Box
      className={ className }
      as="a"
      href={ route({ pathname: '/' }) }
      width={{
        base: '140px',
        lg: isCollapsed === false ? '140px' : '40px',
        xl: isCollapsed ? '40px' : '140px',
      }}
      height={{
        base: '40px',
        lg: isCollapsed === false ? '40px' : '40px',
        xl: isCollapsed ? '40px' : '40px',
      }}
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      aria-label="Link to main page"
    >
      { /* big logo */ }
      <Image
        w="auto"
        h="100%"
        src="/static/tabi_logo.svg"
        alt={ `${ config.chain.name } network logo` }
        // fallback={<LogoFallback isCollapsed={isCollapsed} />}
        display={{
          base: 'block',
          lg: isCollapsed === false ? 'block' : 'none',
          xl: isCollapsed ? 'none' : 'block',
        }}
        style={ logoStyle }
      />
      { /* small logo */ }
      <Image
        w="auto"
        h="100%"
        src="/assets/favicon/favicon.ico"
        alt={ `${ config.chain.name } network logo` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed } isSmall/> }
        display={{
          base: 'none',
          lg: isCollapsed === false ? 'none' : 'block',
          xl: isCollapsed ? 'block' : 'none',
        }}
        style={ iconStyle }
      />
    </Box>
  );
};

export default React.memo(chakra(NetworkLogo));
