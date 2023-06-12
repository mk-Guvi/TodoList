import { ReactNode } from 'react';

type AuthLayoutPropsT = {
  children: ReactNode;
};

export const AuthLayout = (props: AuthLayoutPropsT) => {
  return (
    <div className=" bg-slate-50  h-full w-full grid lg:grid-cols-2">
      <div className="hidden  bg-black text-white justify-center lg:flex items-center ">
        <p className="font-bold text-3xl">Todolist.</p>
      </div>
      <div className="p-4  grid m-auto gap-3   sm:w-[25rem]">{props?.children}</div>
    </div>
  );
};
