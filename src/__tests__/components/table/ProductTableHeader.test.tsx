import { fireEvent } from '@testing-library/react';
import ProductTableHeader from '../../../components/table/ProductTableHeader';
import { render } from '../../test-utils/test-utils';

describe('Unit tests for ProductTableHeader component:', () => {
  const SORT_SOFTWARE_TEST_ID = 'header-sort-software';
  const SORT_LAST_UPDATE_TEST_ID = 'header-sort-update';
  const SORT_COMPATIBILITY_TEST_ID = 'header-sort-compatibility';

  it('should render the ProductTableHeader component and match snapshot', () => {
    const { container } = render(<ProductTableHeader handleSorting={jest.fn()} />);

    expect(container).toMatchSnapshot();
  });

  it('should call the sorting function after clicks on the Software header or sort icon', () => {
    const mockedHandleSorting = jest.fn();
    const { getByTestId } = render(<ProductTableHeader handleSorting={mockedHandleSorting} />);

    expect(mockedHandleSorting).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId(SORT_SOFTWARE_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(2);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'overallCompatibility': { 'field': 'overallCompatibility', 'order': null },
      'lastUpdate': { 'field': 'lastUpdate', 'order': null },
      'testApp': { 'field': 'testApp', 'order': 'asc' }
    });

    fireEvent.click(getByTestId(SORT_SOFTWARE_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(3);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'overallCompatibility': { 'field': 'overallCompatibility', 'order': null },
      'lastUpdate': { 'field': 'lastUpdate', 'order': null },
      'testApp': { 'field': 'testApp', 'order': 'desc' }
    });

    fireEvent.click(getByTestId(SORT_SOFTWARE_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(4);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'overallCompatibility': { 'field': 'overallCompatibility', 'order': null },
      'lastUpdate': { 'field': 'lastUpdate', 'order': null },
      'testApp': { 'field': 'testApp', 'order': null }
    });
  });

  it('should call the sorting function after clicks on the Last update header or sort icon', () => {
    const mockedHandleSorting = jest.fn();
    const { getByTestId } = render(<ProductTableHeader handleSorting={mockedHandleSorting} />);

    expect(mockedHandleSorting).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId(SORT_LAST_UPDATE_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(2);
    expect(mockedHandleSorting).toHaveBeenCalledWith(
      {
        'overallCompatibility': { 'field': 'overallCompatibility', 'order': null },
        'lastUpdate': { 'field': 'lastUpdate', 'order': 'asc' },
        'testApp': { 'field': 'testApp', 'order': null }
      });

    fireEvent.click(getByTestId(SORT_LAST_UPDATE_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(3);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'overallCompatibility': { 'field': 'overallCompatibility', 'order': null },
      'lastUpdate': { 'field': 'lastUpdate', 'order': 'desc' },
      'testApp': { 'field': 'testApp', 'order': null }
    });

    fireEvent.click(getByTestId(SORT_SOFTWARE_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(4);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'overallCompatibility': { 'field': 'overallCompatibility', 'order': null },
      'lastUpdate': { 'field': 'lastUpdate', 'order': null },
      'testApp': { 'field': 'testApp', 'order': null }
    });
  });

  it('should call the sorting function after clicks on the overallCompatibility header or sort icon', () => {
    const mockedHandleSorting = jest.fn();
    const { getByTestId } = render(<ProductTableHeader handleSorting={mockedHandleSorting} />);

    expect(mockedHandleSorting).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId(SORT_COMPATIBILITY_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(2);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'overallCompatibility': { 'field': 'overallCompatibility', 'order': 'asc' },
      'lastUpdate': { 'field': 'lastUpdate', 'order': null },
      'testApp': { 'field': 'testApp', 'order': null }
    });

    fireEvent.click(getByTestId(SORT_COMPATIBILITY_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(3);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'overallCompatibility': { 'field': 'overallCompatibility', 'order': 'desc' },
      'lastUpdate': { 'field': 'lastUpdate', 'order': null },
      'testApp': { 'field': 'testApp', 'order': null }
    });

    fireEvent.click(getByTestId(SORT_SOFTWARE_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(4);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'overallCompatibility': { 'field': 'overallCompatibility', 'order': null },
      'lastUpdate': { 'field': 'lastUpdate', 'order': null },
      'testApp': { 'field': 'testApp', 'order': null }
    });
  });
});
