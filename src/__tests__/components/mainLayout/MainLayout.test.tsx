import MainLayout from '../../../components/mainLayout/MainLayout';
import { render } from '../../test-utils/test-utils';

describe('Unit test for MainLayout component:', () => {
  const childrenExample = <p>Test</p>;

  it('render the MainLayout component', () => {
    const { container } = render(<MainLayout>{childrenExample}</MainLayout>);

    expect(container).toMatchSnapshot();
  });
});
