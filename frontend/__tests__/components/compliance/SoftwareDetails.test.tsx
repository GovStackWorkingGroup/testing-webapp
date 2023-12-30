import SoftwareDetails from '../../../components/compliance/SoftwareDetails';
import { render } from '../../test-utils/test-utils';

describe('Unit tests for SoftwareDetails component:', () => {
  const mockedTitle = 'Test software';

  it('should render the component and match snapshot', () => {
    const { container } = render(
      <SoftwareDetails title={mockedTitle}>
        <div>Test</div>
      </SoftwareDetails>
    );

    expect(container).toMatchSnapshot();
  });

  it('should render the component and match snapshot when complianceSection is true', () => {
    const { container } = render(
      <SoftwareDetails
        title={mockedTitle}
        complianceSection={true}
        softwareVersion="2.0"
      >
        <div>Test</div>
      </SoftwareDetails>
    );

    expect(container).toMatchSnapshot();
  });
});
