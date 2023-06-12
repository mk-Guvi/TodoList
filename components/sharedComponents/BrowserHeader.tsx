import Head from 'next/head';
import { FC, useMemo } from 'react';

interface HeaderPropsI {
  title?: string;
  description?: string;
}

export const BrowserHeader: FC<HeaderPropsI> = (props) => {
  const browserTitle = useMemo(() => `${props.title || 'Todo List'}`, [props.title]);

  return (
    <Head>
      <title>{`${browserTitle}`}</title>
      {props?.description ? <meta name="description" content={props.description} /> : null}
    </Head>
  );
};
