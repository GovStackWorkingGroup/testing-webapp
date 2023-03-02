import React from 'react';
import SubTableRows from '../../../components/table/SubTableRows';
import { render } from '../../test-utils/test-utils';
import { productsList } from './mockedData/ProductTable';

describe('Unit tests for SubTableRows component:', () => {
  const BB_NAME_TEST_ID = 'bb-name';
  const TESTS_PASSED_TEST_ID = 'tests-passed';
  const TESTS_FAILED_TEST_ID = 'tests-failed';
  const COMPATIBILITY_TEST_ID = 'compatibility';

  it('should render the SubTableRows component and match snapshot', () => {
    const { container } = render(
      <SubTableRows compatibilities={productsList.compatibilities} />
    );

    expect(container).toMatchSnapshot();
  });

  it('when have corresponding values', () => {
    const { getByTestId } = render(
      <SubTableRows
        compatibilities={[
          {
            id: '07112c0a-8263-4717-92ce-c52bca785624',
            buildingBlock: 'mobility_management',
            timestamp: 1,
            saveTime: 1659380963000,
            testsPassed: 2,
            testsFailed: 2,
            compatibility: 0.3455,
          },
        ]}
      />
    );

    expect(getByTestId(BB_NAME_TEST_ID)).toHaveTextContent('mobility_management');
    expect(getByTestId(TESTS_PASSED_TEST_ID)).toHaveTextContent('2');
    expect(getByTestId(TESTS_FAILED_TEST_ID)).toHaveTextContent('2');
    expect(getByTestId(COMPATIBILITY_TEST_ID)).toHaveTextContent('34%');
  });
});
