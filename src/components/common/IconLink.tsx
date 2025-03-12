import React, { ReactElement } from 'react';
import { IconButton, IconButtonProps, Link, useColorModeValue } from '@chakra-ui/react';

export const IconLink = ({
  to = '#',
  icon,
  label,
  btnProps,
  bgHover = 'primary.300',
}: {
  label?: string;
  icon: ReactElement;
  to?: string;
  btnProps?: Partial<IconButtonProps>;
  bgHover?: string;
}) => (
  <Link href={to} target={'_blank'}>
    <IconButton
      {...btnProps}
      aria-label={label || to}
      title={to}
      variant="ghost"
      size="lg"
      icon={icon}
      _hover={{
        bg: bgHover,
        color: useColorModeValue('primary.50', 'primary.700'),
      }}
      isRound
    />
  </Link>
);
