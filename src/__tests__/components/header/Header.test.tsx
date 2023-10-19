import { fireEvent } from '@testing-library/react';
import * as Router from 'next/router';
import Header from '../../../components/header/Header';
import { render } from '../../test-utils/test-utils';

describe('Unit tests for Header component:', () => {
  const LOGO_TEST_ID = 'logo';
  const mockedRedirect = jest.fn();
  // @ts-ignore
  jest.spyOn(Router, 'useRouter').mockImplementation(() => ({
    push: mockedRedirect,
  }));

  it('should render the Header component and match snapshot', () => {
    const { container } = render(<Header />);

    expect(container).toMatchSnapshot();
  });

  it('should call the redirect function once after clicks on the logo', () => {
    const { getByTestId } = render(<Header />);

    expect(mockedRedirect).not.toHaveBeenCalled();

    fireEvent.click(getByTestId(LOGO_TEST_ID));

    expect(mockedRedirect).toHaveBeenCalledTimes(1);
    expect(mockedRedirect).toHaveBeenCalledWith('/');
  });
});
