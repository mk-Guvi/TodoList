import React, { InputHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icons';

import { IconTypeT } from '../Icons/iconInner';

export type RenderChildComponentT = {
  component: ReactNode | null;
  className?: string;
} | null;

export type IconEntitiesT = { icon: IconTypeT; iconStyle?: string; onClick?: () => void };
export type InputFieldPropsT = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  LeftRenderChild?: RenderChildComponentT;
  containerClassName?: string;
  iconLeft?: IconEntitiesT;
  iconRight?: IconEntitiesT;
  searchLoading?: boolean;
  RightRenderChild?: RenderChildComponentT;
  disableRing?: boolean;
  roundedStyle?: string;
};

export const RenderChild = (props: RenderChildComponentT) => {
  return <div className={`${props?.className && props?.className}  max-w-[20%]`}>{props?.component}</div>;
};

export const InputField = React.memo(
  React.forwardRef((props: InputFieldPropsT, ref?: any) => {
    const {
      className,
      searchLoading,
      error,
      iconLeft,
      iconRight,
      LeftRenderChild,
      containerClassName,
      RightRenderChild,
      disabled,
      roundedStyle,
      disableRing,
      ...restProps
    } = props;

    return (
      <div
        className={`
        
        ${containerClassName && containerClassName}
        ${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'} 
        ${
          error
            ? `      focus-within:ring-2  focus-within:ring-red-400 focus-within:ring-offset-0`
            : `    focus-within:ring-2  focus-within:ring-blue-500 focus:ring-offset-0`
        }
        ${!disableRing && 'ring-[1px]  ring-gray-500 ring-offset-0'}
        focus-visible:outline-blue-500
        ${roundedStyle || 'rounded-xl'}
        
        w-full  bg-white flex items-center`}>
        {iconLeft ? (
          <Icon icon={iconLeft.icon} className={`${iconLeft?.iconStyle || ''} pl-2 h-8 w-8 `} onClick={iconLeft?.onClick} />
        ) : null}

        {LeftRenderChild && <RenderChild {...LeftRenderChild} />}

        <input
          ref={ref}
          className={`
          ${className ? className : ''}  
          border-0
          ${disabled && 'bg-gray-100'}
          ${roundedStyle || 'rounded-xl'}
          focus-visible:outline-none
          focus-visible:ring-0
          focus:ring-0
          active:ring-0
          ring-0
          
          
          
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} 
        
        px-2
           caret-gray-600    min-h-[2rem] w-full`}
          disabled={disabled}
          autoComplete={`new-password`}
          {...restProps}
        />
        {iconRight ? (
          <Icon
            icon={iconRight.icon}
            className={`${iconRight?.iconStyle && iconRight?.iconStyle} pr-2 h-8 w-8 `}
            onClick={iconRight?.onClick}
          />
        ) : null}

        {!searchLoading && RightRenderChild && <RenderChild {...RightRenderChild} />}
      </div>
    );
  }),
);
