import EvaluationSchemaTable from '../../../components/compliance/EvaluationSchemaTable';
import { render } from '../../test-utils/test-utils';

describe('Unit tests for EvaluationSchemaTable component:', () => {
  it('should render the component and match snapshot', () => {
    const { container } = render(<EvaluationSchemaTable />);

    expect(container).toMatchSnapshot();
  });
});
