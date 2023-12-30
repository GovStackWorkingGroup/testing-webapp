import { fireEvent } from '@testing-library/react';
import TestResultTableHeader from '../../../components/table/TestResultTableHeader';
import { render } from '../../test-utils/test-utils';

describe('Unit tests for TestResultTableHeader component:', () => {
  const STATUS_LABEL_TEST_ID = 'header-status-label';
  const CATEGORY_LABEL_TEST_ID = 'header-category-label';
  const NAME_LABEL_TEST_ID = 'header-name-label';

  const mockedHandleSorting = jest.fn();

  it('should render the TestResultTableHeader component and match snapshot', () => {
    const { container } = render(<TestResultTableHeader handleSorting={mockedHandleSorting}/>);

    expect(container).toMatchSnapshot();
  });

  it('should have proper labels', () => {
    const { getByTestId } = render(<TestResultTableHeader handleSorting={mockedHandleSorting}/>);

    expect(getByTestId(STATUS_LABEL_TEST_ID)).toHaveTextContent('Status');
    expect(getByTestId(CATEGORY_LABEL_TEST_ID)).toHaveTextContent('Category');
    expect(getByTestId(NAME_LABEL_TEST_ID)).toHaveTextContent('Name');
  });

  it('should call the sorting function after clicks on the Status header or sort icon', () => {
    const mockedHandleSorting = jest.fn();
    const { getByTestId } = render(<TestResultTableHeader handleSorting={mockedHandleSorting} />);

    expect(mockedHandleSorting).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId(STATUS_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(2);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'status': { 'field': 'status', 'order': 'asc' },
      'uri': { 'field': 'uri', 'order': null },
      'name': { 'field': 'name', 'order': null }
    });

    fireEvent.click(getByTestId(STATUS_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(3);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'status': { 'field': 'status', 'order': 'desc' },
      'uri': { 'field': 'uri', 'order': null },
      'name': { 'field': 'name', 'order': null }
    });

    fireEvent.click(getByTestId(STATUS_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(4);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'status': { 'field': 'status', 'order': null },
      'uri': { 'field': 'uri', 'order': null },
      'name': { 'field': 'name', 'order': null }
    });
  });

  it('should call the sorting function after clicks on the Category header or sort icon', () => {
    const mockedHandleSorting = jest.fn();
    const { getByTestId } = render(<TestResultTableHeader handleSorting={mockedHandleSorting} />);

    expect(mockedHandleSorting).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId(CATEGORY_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(2);
    expect(mockedHandleSorting).toHaveBeenCalledWith(
      {
        'status': { 'field': 'status', 'order': null },
        'uri': { 'field': 'uri', 'order': 'asc' },
        'name': { 'field': 'name', 'order': null }
      });

    fireEvent.click(getByTestId(CATEGORY_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(3);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'status': { 'field': 'status', 'order': null },
      'uri': { 'field': 'uri', 'order': 'desc' },
      'name': { 'field': 'name', 'order': null }
    });

    fireEvent.click(getByTestId(STATUS_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(4);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'status': { 'field': 'status', 'order': null },
      'uri': { 'field': 'uri', 'order': null },
      'name': { 'field': 'name', 'order': null }
    });
  });

  it('should call the sorting function after clicks on the Name header or sort icon', () => {
    const mockedHandleSorting = jest.fn();
    const { getByTestId } = render(<TestResultTableHeader handleSorting={mockedHandleSorting} />);

    expect(mockedHandleSorting).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId(NAME_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(2);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'status': { 'field': 'status', 'order': null },
      'uri': { 'field': 'uri', 'order': null },
      'name': { 'field': 'name', 'order': 'asc' }
    });

    fireEvent.click(getByTestId(NAME_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(3);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'status': { 'field': 'status', 'order': null },
      'uri': { 'field': 'uri', 'order': null },
      'name': { 'field': 'name', 'order': 'desc' }
    });

    fireEvent.click(getByTestId(STATUS_LABEL_TEST_ID));
    expect(mockedHandleSorting).toHaveBeenCalledTimes(4);
    expect(mockedHandleSorting).toHaveBeenCalledWith({
      'status': { 'field': 'status', 'order': null },
      'uri': { 'field': 'uri', 'order': null },
      'name': { 'field': 'name', 'order': null }
    });
  });
});
