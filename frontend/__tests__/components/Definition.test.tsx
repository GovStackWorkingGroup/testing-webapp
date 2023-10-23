import Definition from '../../components/Definition';
import { render } from '../test-utils/test-utils';

describe('Unit tests for Definition component:', () => {
  const TITLE_TEST_ID = 'definition-title';
  const DESCRIPTION_TEST_ID = 'definition-description';
  const NOTE_TEST_ID = 'definition-note';

  it('should render the component and match snapshot', () => {
    const { container } = render(<Definition />);

    expect(container).toMatchSnapshot();
  });

  it('should have corresponding values', () => {
    const { getByTestId } = render(<Definition />);

    expect(getByTestId(TITLE_TEST_ID)).toHaveTextContent('GovStack Building Block Compliance Platform');
    expect(getByTestId(DESCRIPTION_TEST_ID)).toHaveTextContent(
    // eslint-disable-next-line max-len
      'This web application is used to show how candidate products align with the technical specifications that have been developed by Govstack for various Building Blocks. For each Building Blocks a series of APIs have been defined and tests have been developed which any compliant product must be able to pass. These tests are run against candidate platforms and this application provides detailed information on which tests are passing and which are failing. Users may select any building block that they are interested and view candidate products as well as their current level of compliance with the API.'
    );
    expect(getByTestId(NOTE_TEST_ID)).toHaveTextContent(
      'Note: Technical/API compliance is only a part of the full GovStack compliance process'
    );
  });

  it('description should have href attributes', () => {
    const { getByText } = render(<Definition />);

    expect(getByText('Govstack')).toHaveAttribute('href', 'https://www.govstack.global/');
    expect(getByText('Building Blocks')).toHaveAttribute('href', 'https://govstack.gitbook.io/specification/');
  });
});
