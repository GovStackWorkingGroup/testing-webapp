import Definition from '../../components/Definition';
import { render } from '../test-utils/test-utils';

describe('Unit tests for Definition component:', () => {
  const TITLE_TEST_ID = 'definition-title';
  const DESCRIPTION_TEST_ID = 'definition-description';
  const NOTE_TEST_ID = 'definition-note';

  const mockedTitle = 'Test title';
  const mockedDescription = 'Test description';
  const mockedNote = 'Test note';

  it('should render the component and match snapshot', () => {
    const { container } = render(
      <Definition title={mockedTitle} description={mockedDescription} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should have corresponding values', () => {
    const { getByTestId } = render(
      <Definition
        title={mockedTitle}
        description={mockedDescription}
        note={mockedNote}
      />
    );

    expect(getByTestId(TITLE_TEST_ID)).toHaveTextContent(mockedTitle);
    expect(getByTestId(DESCRIPTION_TEST_ID)).toHaveTextContent(
      mockedDescription
    );
    expect(getByTestId(NOTE_TEST_ID)).toHaveTextContent(mockedNote);
  });
});
