import TestResultTable from '../../../components/table/TestResultTable';
import { render } from '../../test-utils/test-utils';
import { buildingBlockTestSummary } from './mockedData/ProductTable';

describe('Unit tests for TestResultTable component:', () => {
  const LAST_UPDATE_TEST_ID = 'test-table-last-update';
  const RESULT_TEST_ID = 'test-table-result';

  it('should match snapshot', () => {
    const { container } = render(
      <TestResultTable bbSummary={buildingBlockTestSummary} passCurrentBBTest={jest.fn()} handleSorting={jest.fn()}/>
    );

    expect(container).toMatchSnapshot();
  });

  it('should have corresponding values when building block summary is defined', () => {
    const { getByTestId } = render(
      <TestResultTable bbSummary={buildingBlockTestSummary} passCurrentBBTest={jest.fn()} handleSorting={jest.fn()}/>
    );

    expect(getByTestId(LAST_UPDATE_TEST_ID)).toHaveTextContent('8/1/2022');
    expect(getByTestId(RESULT_TEST_ID)).toHaveTextContent('1 result');
  });

  it('should have corresponding values when building block summary is undefined', () => {
    const { getByTestId } = render(
      <TestResultTable
        bbSummary={undefined}
        passCurrentBBTest={jest.fn()}
        handleSorting={jest.fn()}
      />);

    expect(getByTestId(LAST_UPDATE_TEST_ID)).toHaveTextContent('-');
    expect(getByTestId(RESULT_TEST_ID)).toHaveTextContent('- result');
  });
});
