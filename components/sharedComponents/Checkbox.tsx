import React from 'react';
import { Icon } from '../Icons';


type CheckboxPropsT = {
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  checked?: boolean;
  iconClassName?: string;
  disabled?: boolean;
  containerClassName?: string;
  disableTransition?: boolean;
};

// eslint-disable-next-line react/display-name
export const Checkbox = React.memo((props: CheckboxPropsT) => {
  const { checked,  disableTransition, disabled, containerClassName, iconClassName, onClick } = props;
  return (
    <div
      onClick={(e) => {
        if (!disabled && onClick) {
          onClick(e);
        }
      }}
      className={`${containerClassName ? containerClassName : ''} ${disabled ? 'cursor-not-allowed' : ''} ${
        !disableTransition ? 'transition-all duration-150' : ''
      } active:ring-2 active:ring-offset-0 group rounded border-[1px] h-5 w-5 ${
        checked ? 'bg-blue-500 text-white border-blue-700' : 'bg-white text-gray-500'
      } cursor-pointer shadow  inline-flex justify-center items-center`}
    >
      <Icon
        
        icon="check"

        className={`${iconClassName ? iconClassName : ''}  p-0.5 text-inherit  ${!checked && 'invisible group-hover:visible'}`}
      />
    </div>
  );
});
