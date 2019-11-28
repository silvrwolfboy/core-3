import React, { cloneElement, Children, isValidElement } from 'react';
import { ToggleLayer, Transition, RenderLayerProps, LayerSide } from 'react-laag';
import { Props as ToggleLayerProps } from 'react-laag/dist/ToggleLayer/ToggleLayer';
import ResizeObserver from '@juggle/resize-observer';
import { Box } from '../../quarks';
import { Backdrop } from '../Backdrop';

interface TriggerProps {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  triggerRef: React.RefObject<any>;
  layerSide: LayerSide | null;
}

interface LayerProps extends RenderLayerProps {
  onTransitionEnd(): void;
}

interface Props extends Omit<ToggleLayerProps, 'children' | 'renderLayer'> {
  layer: ((props: LayerProps) => React.ReactElement) | React.ReactElement;
  trigger: ((props: TriggerProps) => React.ReactElement) | React.ReactElement;
  closeOnClick?: boolean;
  withBackdrop?: boolean;
}

export const Menu = ({
  trigger,
  layer,
  closeOnClick = true,
  placement,
  withBackdrop,
  ...props
}: Props) => {
  const renderTrigger = (childrenProps: TriggerProps) => {
    if (isValidElement(trigger)) {
      return cloneElement(Children.only(trigger), {
        ref: childrenProps.triggerRef,
        onClick: childrenProps.toggle,
      });
    }

    return trigger(childrenProps);
  };

  const renderLayer = ({ isOpen, layerProps, close, ...restLayerProps }: RenderLayerProps) => (
    <Transition isOpen={isOpen}>
      {(open, onTransitionEnd) => {
        if (isValidElement(layer)) {
          return (
            <Box
              ref={layerProps.ref}
              sx={{
                ...layerProps.style,
                zIndex: 100,
                transition: 'opacity 150ms ease-in-out',
                opacity: open ? 1 : 0,
                minWidth: 'max-content',
                width: ['100%', 'initial'],
                px: [3, 0],
              }}
              left={[0, layerProps.style.left!]}
              onClick={closeOnClick ? close : undefined}
              onTransitionEnd={onTransitionEnd}
              {...restLayerProps}
            >
              {layer}
              {withBackdrop && open && <Backdrop zIndex={-1} />}
            </Box>
          );
        }

        return layer({
          isOpen: open,
          close,
          layerProps,
          onTransitionEnd,
          ...restLayerProps,
        });
      }}
    </Transition>
  );
  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      renderLayer={renderLayer}
      placement={{
        anchor: 'BOTTOM_CENTER',
        triggerOffset: -1,
        ...placement,
      }}
      closeOnOutsideClick
      closeOnDisappear="full"
      {...props}
    >
      {renderTrigger}
    </ToggleLayer>
  );
};
