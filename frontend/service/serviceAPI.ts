import {
  ResultTableSortByType,
  SoftwaresTableSortByType,
} from '../components/table/types';
import { BuildingBlockTestSummary, ProductsListType } from './types';

const baseUrl = process.env.API_URL || 'http://localhost:5000';

type Success<T> = { status: true; data: T };
type Failure = { status: false; error: Error };

const handleFieldsToSort = (
  sortBy: ResultTableSortByType | SoftwaresTableSortByType
) =>
  Object.values(sortBy)
    .filter((order) => order.order !== null)
    .map((sortProperty) => `sort.${sortProperty.field}=${sortProperty.order}`)
    .join('&');

const baseFetch = async (url: string): Promise<ProductsListType> => {
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export const getSoftwaresData = async (
  offset: number,
  sortBy: SoftwaresTableSortByType,
  branch?: string
): Promise<Success<ProductsListType> | Failure> => {
  try {
    const url = new URL(`${baseUrl}/report/`);
    url.searchParams.set('limit', '20');
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('branch', branch || 'main');

    const sortedParameters = handleFieldsToSort(sortBy);
    for (const param of sortedParameters.split('&')) {
      const [key, value] = param.split('=');
      url.searchParams.set(key, value);
    }

    const actualData = await baseFetch(url.toString());

    return { data: actualData, status: true };
  } catch (error) {
    return {
      status: false,
      error: error as Error,
    };
  }
};

export const getSoftwareListCount = async (
  branch?: string
): Promise<Success<number> | Failure> => {
  try {
    const url = new URL(`${baseUrl}/report/count`);

    // Assuming branch is a query parameter. If not, this can be removed.
    const params = new URLSearchParams({ branch: branch || 'main' });
    url.search = params.toString();

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const result = await response.json();

    return {
      status: true,
      data: result.count,
    };
  } catch (error) {
    return {
      status: false,
      error: error as Error,
    };
  }
};

export const getBuildingBlockTestResults = async (
  buildingBlockId: string,
  sortBy: ResultTableSortByType
) => {
  const sortedParameters = handleFieldsToSort(sortBy);

  return await fetch(
    `${baseUrl}/report/${buildingBlockId}?${sortedParameters}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<BuildingBlockTestSummary>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};
