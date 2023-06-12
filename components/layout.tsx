import { ReactNode } from 'react';

type LayoutPropsT = {
  children?: ReactNode | null;
  classNameContainer?: string;
  classNameChildren?: string;
};
export function Layout(props: LayoutPropsT) {
  return (
    <div className={`${props?.classNameContainer || ''}  w-screen flex   h-screen overflow-auto bg-layout`}>
      {props?.children ? <div className={`${props?.classNameChildren || ''}   p-4 flex-1`}>{props?.children}</div> : null}
    </div>
  );
}
