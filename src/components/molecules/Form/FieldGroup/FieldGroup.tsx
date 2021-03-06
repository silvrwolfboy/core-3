import React, { forwardRef, isValidElement } from 'react';
import { Flex, Box } from '../../../quarks';
import { Label, Message } from '../../../atoms';

type TValue = number | string | undefined;
type TMaxLength = number | undefined;

export interface FieldGroupProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
  error?: React.ReactNode;
  value?: TValue;
  maxLength?: TMaxLength;
}

const getElement = (Wrapper: React.ReactType, component?: React.ReactNode, props?: Object) => {
  if (isValidElement(component) || component === null) {
    return component;
  }
  return <Wrapper {...props}>{component}&#8203;</Wrapper>;
};

const getCounterValue = (value: TValue, maxLength: TMaxLength) => {
  let _value = 0;

  if (value && typeof value === 'string') {
    _value = value.length;
  }

  return `${_value}/${maxLength}`;
};

export const FieldGroup = forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ label, error, children, value, maxLength, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {getElement(Label, label, { mb: 1 })}
      {children}
      <Flex justifyContent="space-between">
        {getElement(Message, error, { color: 'pink', marginY: 1 })}
        {maxLength && (
          <Message mt={1} ml={2} fontWeight={600} color="2">
            {getCounterValue(value, maxLength)}
          </Message>
        )}
      </Flex>
    </Box>
  )
);
