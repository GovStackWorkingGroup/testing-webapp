import { fireEvent } from '@testing-library/react';
import * as Router from 'next/router';
import { render } from '../../test-utils/test-utils';
import HeaderMenuButton from '../../../components/header/HeaderMenuButton';

describe('Unit tests for HeaderMenuButton component:', () => {
  const BUTTON_TEST_ID = 'header-menu-button';

  const mockedButtonTitle = 'Test button';
  const mockedHref = '/test_url';

  const mockedRedirect = jest.fn();
  // @ts-ignore
  jest.spyOn(Router, 'useRouter').mockImplementation(() => ({
    push: mockedRedirect,
  }));

  it('should render the HeaderMenuButton component and match snapshot', () => {
    const { container } = render(
      <HeaderMenuButton buttonTitle={mockedButtonTitle} href={mockedHref} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should have href attribute', () => {
    const { getByTestId } = render(
      <HeaderMenuButton buttonTitle={mockedButtonTitle} href={mockedHref} />
    );

    fireEvent.click(getByTestId(BUTTON_TEST_ID));

    expect(getByTestId(BUTTON_TEST_ID).tagName).toBe('A');
    expect(getByTestId(BUTTON_TEST_ID).getAttribute('href')).toBe(mockedHref);
  });

  it('should have specific className when pass "active" props', () => {
    const { getByTestId } = render(
      <HeaderMenuButton
        buttonTitle={mockedButtonTitle}
        href={mockedHref}
        active={true}
      />
    );

    expect(getByTestId(BUTTON_TEST_ID)).toHaveProperty(
      'className',
      expect.stringContaining('header-menu-button-active')
    );
  });

  it('should do not have specific className when not passing "active" props', () => {
    const { getByTestId } = render(
      <HeaderMenuButton buttonTitle={mockedButtonTitle} href={mockedHref} />
    );

    expect(getByTestId(BUTTON_TEST_ID)).not.toHaveProperty(
      'className',
      expect.stringContaining('header-menu-button-active')
    );
  });
});
