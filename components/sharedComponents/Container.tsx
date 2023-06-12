import { ReactNode } from 'react';

type ContainerPropsT = {
  className?: string;
  children?: ReactNode | null;
};

export const Container = (props: ContainerPropsT) => {
  return <div className={`${props?.className || ''} h-full w-full overflow-auto`}>{props?.children}</div>;
};
