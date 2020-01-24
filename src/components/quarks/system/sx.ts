import { forIn } from 'lodash';
import css, { SystemStyleObject } from '@styled-system/css';
import { BoxProps } from '../Reflexbox';
import { colorKeys, transform as transformColor } from './colors';
import { transformFontScale } from './fontScale';

type TValue = number | string;
type TSxObject = {
  [key: string]: TValue | TValue[];
};

const transformWithArrayCheck = (
  value: TValue | TValue[],
  transform: (value: string | number) => TValue
) => {
  if (Array.isArray(value)) {
    return value.map(x => transform(x));
  }

  return transform(value);
};

/** Mutates "obj" param */
const parseSX = (obj: TSxObject, props: BoxProps) => {
  forIn(obj, (value, key) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return parseSX(value, props);
    }

    if (key === 'fontScale') {
      obj.font = transformWithArrayCheck(obj.fontScale, v =>
        transformFontScale(props)(v, props.theme?.fontScales)
      );
      delete obj.fontScale;
    }

    if (colorKeys.includes(key)) {
      obj[key] = transformWithArrayCheck(value, v => transformColor(v, props.theme?.colors));
    }
  });
};

export const sx = (props: BoxProps) => {
  const sx = { ...props.sx } as TSxObject;

  parseSX(sx, props);

  return css(sx as SystemStyleObject)(props.theme);
};
