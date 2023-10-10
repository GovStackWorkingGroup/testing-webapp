import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { IntlProvider } from 'react-intl';
import * as translations from '../../translations';
import { mockNextUseRouter } from './nextMockImplementation';

type ProviderProps = {
  children: React.ReactNode;
};

mockNextUseRouter();

const Providers = ({ children }: ProviderProps) => {
  const locale = 'en';
  const messages = { ...translations.en, ...translations[locale] };

  return (
    <IntlProvider locale={locale} defaultLocale='en' messages={messages}>
      {children}
    </IntlProvider>
  );
};

const customRender = ( ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: Providers, ...options });

// override render method
export { customRender as render };
