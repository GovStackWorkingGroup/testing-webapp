import { FormValuesType } from '../components/form/SoftwareAttributesForm';
import {
  ResultTableSortByType,
  SoftwaresTableSortByType,
} from '../components/table/types';
import {
  BuildingBlockTestSummary,
  ComplianceList,
  ComplianceRequirementsType,
  FormUpdatedObject,
  PATCHSoftwareAttributesType,
  POSTSoftwareAttributesType,
  ProductsListType,
  SoftwareDetailsDataType,
  SoftwareDetailsType,
  SoftwareDraftDetailsType,
  SoftwareDraftToUpdateType,
  SubmitDraftResponseType,
  SubmittingFormResponseType,
  FilterOptionsType,
  ListFilters,
  FormErrorResponseType
} from './types';

export const baseUrl = process.env.API_URL;

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
  branch?: string,
  showAll?: boolean
): Promise<Success<ProductsListType> | Failure> => {
  try {
    const url = new URL(`${baseUrl}/report/`);

    url.searchParams.set('offset', offset.toString());
    if (!showAll) {
      url.searchParams.set('limit', '20');
      url.searchParams.set('branch', branch || 'main');
    }

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

interface TransformedFilter {
  name: string;
  version?: string[];
}

interface ListFilter {
  software?: TransformedFilter[];
  bb?: TransformedFilter[];
}

export const getComplianceList = async (offset: number, limit: number, filters: ListFilters) => {
  const softwares = Object.keys(filters.software).map(key => {
    const filterObject: TransformedFilter = { name: key };
    if (filters.software[key].length > 0) {
      filterObject.version = filters.software[key];
    }

    return filterObject;
  });

  const bbs = Object.keys(filters.bb).map(key => {

    const filterObject: TransformedFilter = { name: key };
    if (filters.bb[key].length > 0) {
      filterObject.version = filters.bb[key];
    }

    return filterObject;
  });

  const queryFilters: ListFilter = {};

  if (softwares) {
    queryFilters.software = softwares;
  }

  if (bbs) {
    queryFilters.bb = bbs;
  }

  const stringFilter: string = JSON.stringify(queryFilters);

  const accessToken = sessionStorage.getItem('accessToken');

  return await fetch(
    `${baseUrl}/compliance/list?offset=${offset}&limit=${limit}&filters=${stringFilter}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<ComplianceList>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const getSoftwareDetails = async (softwareName: string) => {
  const accessToken = sessionStorage.getItem('accessToken');

  return await fetch(`${baseUrl}/compliance/${softwareName}/detail`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<SoftwareDetailsType>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

// eslint-disable-next-line max-len
export const saveSoftwareDraft = async (software: FormValuesType): Promise<{ data?: POSTSoftwareAttributesType; error?: FormErrorResponseType; status: boolean }> => {
  const formData = new FormData();
  formData.append('softwareName', software.softwareName.value);
  formData.append('logo', software.softwareLogo.value as File);
  formData.append('website', software.softwareWebsite.value);
  formData.append('documentation', software.softwareDocumentation.value);
  formData.append('description', software.toolDescription.value);
  formData.append('email', software.email.value);
  formData.append('version', software.softwareVersion.value);
  formData.append('compliance[0][version]', software.softwareVersion.value);

  return await fetch(`${baseUrl}/compliance/drafts`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        const errorMessage = response.status === 413
          ? 'The logo file size exceeds the 1 MB limit. Please upload a smaller file.'
          : response.statusText || 'An error occurred while saving the draft.';

        const error: FormErrorResponseType = { status: response.status, name: 'CustomError', message: errorMessage };
        throw error;
      }

      return response.json();
    })
    .then<Success<POSTSoftwareAttributesType>>((response) => {
      return { data: response, status: true };
    })
    .catch((error: FormErrorResponseType) => {
      return {
        error,
        status: false,
      };
    });
};

export const getDraftDetails = async (draftUUID: string) => {
  return await fetch(`${baseUrl}/compliance/drafts/${draftUUID}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<SoftwareDraftDetailsType>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const getComplianceRequirements = async () => {
  return await fetch(`${baseUrl}/compliance/requirements/`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<ComplianceRequirementsType[]>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const updateDraftDetailsStepOne = async (
  draftUUID: string,
  data: FormValuesType
): Promise<{ data?: POSTSoftwareAttributesType; error?: FormErrorResponseType; status: boolean }> => {
  const formData = new FormData();

  formData.append('softwareName', data.softwareName.value);
  formData.append('logo', data.softwareLogo.value as File);
  formData.append('website', data.softwareWebsite.value);
  formData.append('documentation', data.softwareDocumentation.value);
  formData.append('description', data.toolDescription.value);
  formData.append('email', data.email.value);
  formData.append('compliance[0][version]', data.softwareVersion.value);

  return await fetch(`${baseUrl}/compliance/drafts/${draftUUID}`, {
    method: 'PATCH',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        const errorMessage = response.status === 413
          ? 'The logo file size exceeds the 1 MB limit. Please upload a smaller file.'
          : response.statusText || 'An error occurred while updating the draft.';

        const error: FormErrorResponseType = { status: response.status, name: 'CustomError', message: errorMessage };
        throw error;
      }

      return response.json();
    })
    .then<Success<POSTSoftwareAttributesType>>((response) => {
      return { data: response, status: true };
    })
    .catch((error: FormErrorResponseType) => {
      return {
        error,
        status: false,
      };
    });
};

export const updateDraftDetailsStepTwo = async (
  draftUUID: string,
  data: SoftwareDraftToUpdateType
) => {
  const formData = new FormData();

  if (
    data.deploymentCompliance?.documentation ||
    data.deploymentCompliance?.documentation === ''
  ) {
    if (data.deploymentCompliance?.documentation instanceof File) {
      formData.append(
        'deploymentCompliance[documentation]',
        data.deploymentCompliance.documentation
      );
    } else {
      formData.append(
        'deploymentCompliance[documentation]',
        data.deploymentCompliance?.documentation
      );
    }
  }

  if (
    data.deploymentCompliance?.deploymentInstructions ||
    data.deploymentCompliance?.deploymentInstructions === ''
  ) {
    if (data.deploymentCompliance?.deploymentInstructions instanceof File) {
      formData.append(
        'deploymentCompliance[deploymentInstructions]',
        data.deploymentCompliance?.deploymentInstructions
      );
    } else {
      formData.append(
        'deploymentCompliance[deploymentInstructions]',
        data.deploymentCompliance?.deploymentInstructions || ''
      );
    }
  }

  return await fetch(`${baseUrl}/compliance/drafts/${draftUUID}`, {
    method: 'PATCH',
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<PATCHSoftwareAttributesType>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const updateDraftDetailsStepThree = async (
  draftUUID: string,
  data: ComplianceRequirementsType[],
  softwareVersion: string
) => {
  const transformedData = data.map((item) => {
    const {
      bbKey,
      bbName,
      bbVersion,
      dateOfSave,
      requirements,
      interfaceCompliance,
    } = item;
    const test = {
      bbSpecification: bbName,
      bbVersion,
      dateOfSave,
      requirementSpecificationCompliance: {
        crossCuttingRequirements: requirements.crossCutting.map(
          (crossCuttingItem) => ({
            requirement: crossCuttingItem.requirement,
            comment: crossCuttingItem.comment,
            fulfillment: crossCuttingItem.fulfillment,
            link: crossCuttingItem.link,
            _id: crossCuttingItem._id,
            status: crossCuttingItem.status,
          })
        ),
        functionalRequirements: requirements.functional.map(
          (functionalItem) => ({
            requirement: functionalItem.requirement,
            comment: functionalItem.comment,
            fulfillment: functionalItem.fulfillment,
            link: functionalItem.link,
            _id: functionalItem._id,
            status: functionalItem.status,
          })
        ),
        keyDigitalFunctionalitiesRequirements: requirements.keyDigitalFunctionalities.map(
          (KDFItem) => ({
            requirement: KDFItem.requirement,
            comment: KDFItem.comment,
            fulfillment: KDFItem.fulfillment,
            link: KDFItem.link,
            _id: KDFItem._id,
            status: KDFItem.status,
          })
        )
      },
      interfaceCompliance: {
        testHarnessResult: interfaceCompliance?.testHarnessResult || '',
        requirements: interfaceCompliance?.requirements || [],
      },
    };

    return {
      [bbKey]: test,
    };
  });

  const transformedDataObject = transformedData.reduce((acc, item) => {
    const bbKey = Object.keys(item)[0];

    if (bbKey) {
      acc[bbKey] = item[bbKey];
    }

    return acc;
  }, {});

  const payload = {
    compliance: {
      version: softwareVersion,
      bbDetails: transformedDataObject,
    },
  };

  return await fetch(`${baseUrl}/compliance/drafts/${draftUUID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<PATCHSoftwareAttributesType>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const submitDraft = async (uniqueId: string) => {
  const payload = { uniqueId };

  return await fetch(`${baseUrl}/compliance/drafts/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<SubmitDraftResponseType>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const getSoftwareDetailsReport = async (id: string) => {
  return await fetch(`${baseUrl}/compliance/forms/${id}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<SoftwareDetailsDataType>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const getFilters = async (filterType: string) => {
  return await fetch(`${baseUrl}/compliance/filters/${filterType}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<FilterOptionsType>>((actualData) => {
      return { data: actualData, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const handleReviewSoftwareForm = async (
  id: string,
  data: FormUpdatedObject,
  type: 'update' | 'accept' | 'reject'
) => {
  const accessToken = sessionStorage.getItem('accessToken');

  return await fetch(`${baseUrl}/compliance/forms/${id}/${type}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<SubmittingFormResponseType>>((response) => {
      return { data: response, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

export const handleDeleteSoftwareForm = async (
  id: string,
) => {
  const accessToken = sessionStorage.getItem('accessToken');

  return await fetch(`${baseUrl}/compliance/forms/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    })
    .then<Success<SubmittingFormResponseType>>((response) => {
      return { data: response, status: true };
    })
    .catch<Failure>((error) => {
      return { error, status: false };
    });
};

// This endpoint do not connect to project BE
export const checkIfImageUrlExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });

    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Fetch file
export const fetchFileDetails = async (file: string) => {
  const filePath = `${baseUrl}/${file}`;
  try {
    const response = await fetch(filePath, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const blob = await response.blob();

    // Create a File object from the Blob
    const url = new URL(filePath);

    const pathname = url.pathname;

    const parts = pathname.split('/');

    const fileName = parts[parts.length - 1]; // Provide the desired file name
    const file = new File([blob], fileName, { type: contentType });

    return file;
  } catch (error) {
    return undefined;
  }
};
