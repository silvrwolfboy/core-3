import styled from 'styled-components';
import { ObjectFitProperty, ObjectPositionProperty } from 'csstype';
import { system } from 'styled-system';
import { Box, BoxProps } from './Reflexbox';
import { FC } from 'react';

export interface ImageProps extends BoxProps<HTMLImageElement> {
  objectFit?: ObjectFitProperty;
  objectPosition?: ObjectPositionProperty<string>;
}

const objectImage = system({
  objectFit: true,
  objectPosition: true,
});

export const Image: FC<ImageProps> = styled(Box).attrs({
  as: 'img',
})`
  ${objectImage}
`;
