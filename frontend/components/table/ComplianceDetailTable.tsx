import React, { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { RiQuestionLine } from 'react-icons/ri';
import classNames from 'classnames';
import { RequirementsType } from '../../service/types';
import useTranslations from '../../hooks/useTranslation';
import { SoftwareDetailsDataType } from '../../service/types';
import BBImage from '../BuildingBlocksImage';
import CustomSelect, { OptionsType } from '../shared/inputs/Select';
import Button from '../shared/buttons/Button';

type ComplianceDetailTable = {
  data: SoftwareDetailsDataType | undefined;
  savedFormState: { [key: string]: boolean };
  handleOpenEvaluationSchemaModal: (value: boolean) => void;
  handleFormAction: (
    data: ComplianceDetailFormValuesType[],
    type: 'update' | 'accept' | 'reject'
  ) => Promise<void>;
};

type TransformedDataType = {
  id: string;
  bbName: string;
  interfaceCompliance: { requirements: RequirementsType[] };
  requirementSpecificationCompliance: {
    crossCuttingRequirements: RequirementsType[];
    functionalRequirements: RequirementsType[];
  };
};

export type ComplianceDetailFormValuesType = {
  id: string;
  bbName: string;
  interface: { level: number; note: string };
  deployment: { level: number; note: string };
  requirement: { level: number; note: string };
};

const ComplianceDetailTable = ({
  data,
  savedFormState,
  handleOpenEvaluationSchemaModal,
  handleFormAction,
}: ComplianceDetailTable) => {
  const [transformedData, setTransformedData] =
    useState<TransformedDataType[]>();
  const [updatedFormValues, setUpdatedFormValues] =
    useState<ComplianceDetailFormValuesType[]>();

  const { format } = useTranslations();

  const headers = [
    'table.compliance.label',
    'building_block.plural.label',
    'table.compliance_level.label',
    'table.notes',
  ];

  useEffect(() => {
    if (data?.formDetails?.length) {
      const newData = Object.entries(data.formDetails[0].bbDetails).map(
        ([bbName, rest]) => {
          return {
            id: data.formDetails[0].id,
            bbName,
            ...rest,
          };
        }
      );
      setTransformedData(newData);
      const updatedData = newData.map((item) => {
        return {
          id: item.id,
          bbName: item.bbName,
          interface: { level: -1, note: '' },
          deployment: { level: -1, note: '' },
          requirement: { level: -1, note: '' },
        };
      });
      setUpdatedFormValues(updatedData);
    }
  }, [data]);

  const onAction = (
    data: ComplianceDetailFormValuesType[] | undefined,
    type: 'update' | 'accept' | 'reject'
  ) => {
    if (!data) {
      throw new Error('Data is missing');
    }

    handleFormAction(data, type);
  };

  const handleOnSelect = (value: SingleValue<OptionsType>) => {
    const index = value?.value;
    let level: number;

    switch (value?.label) {
    case 'Level 1':
      level = 1;
      break;
    case 'Level 2':
      level = 2;
      break;
    case 'N/A':
      level = -1;
      break;
    }

    if (updatedFormValues && index) {
      const formValues = [...updatedFormValues];
      const parts = index?.split('-');
      const indexBB = parts.slice(1).join('-');

      if (index.startsWith('deployment')) {
        setUpdatedFormValues(
          formValues.map((item) => ({
            ...item,
            deployment: { level, note: item.deployment.note },
          }))
        );

        return;
      }

      if (index.startsWith('interface')) {
        const updatedArray = formValues.map((item) => {
          if (item.bbName === indexBB) {
            return {
              ...item,
              interface: { level, note: item.interface.note },
            };
          }

          return item;
        });
        setUpdatedFormValues(updatedArray);

        return;
      }

      if (index.startsWith('requirement')) {
        const updatedArray = formValues.map((item) => {
          if (item.bbName === indexBB) {
            return {
              ...item,
              requirement: { level, note: item.requirement.note },
            };
          }

          return item;
        });
        setUpdatedFormValues(updatedArray);

        return;
      }
    }
  };

  const handleTextarea = (field: string, value: string) => {
    const index = field;

    if (updatedFormValues && index) {
      const formValues = [...updatedFormValues];
      const parts = index?.split('-');
      const indexBB = parts.slice(1).join('-');

      if (index.startsWith('deployment')) {
        setUpdatedFormValues(
          formValues.map((item) => ({
            ...item,
            deployment: { level: item.deployment.level, note: value },
          }))
        );

        return;
      }

      if (index.startsWith('interface')) {
        const updatedArray = formValues.map((item) => {
          if (item.bbName === indexBB) {
            return {
              ...item,
              interface: { level: item.interface.level, note: value },
            };
          }

          return item;
        });
        setUpdatedFormValues(updatedArray);

        return;
      }

      if (index.startsWith('requirement')) {
        const updatedArray = formValues.map((item) => {
          if (item.bbName === indexBB) {
            return {
              ...item,
              requirement: { level: item.requirement.level, note: value },
            };
          }

          return item;
        });
        setUpdatedFormValues(updatedArray);

        return;
      }
    }
  };

  return data?.formDetails?.length ? (
    <div>
      <table className='main-table'>
        <thead>
          <tr className='border'>
            {headers.map((header, indexKey) => {
              if (header === 'table.compliance_level.label') {
                return (
                  <th key={`header-${header}-${indexKey}`}>
                    <div className='th-header-with-icon'>
                      <p>{format(header)}</p>
                      <RiQuestionLine
                        className='th-icon-question-mark cursor-pointer'
                        onClick={() => handleOpenEvaluationSchemaModal(true)}
                      />
                    </div>
                  </th>
                );
              }

              return <th key={`header-th-${indexKey}`}>{format(header)}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          <tr className='border'>
            <td>{format('table.deployment.label')}</td>
            <td>{'-'}</td>
            <td>
              <CustomSelect
                options={[
                  {
                    value: 'deployment',
                    label: format('evaluation_schema.level_1.label'),
                  },
                  {
                    value: 'deployment',
                    label: format('evaluation_schema.level_2.label'),
                  },
                  {
                    value: 'deployment',
                    label: format('table.N/A.label'),
                  },
                ]}
                onChange={handleOnSelect}
                placeholder={format('app.select.label')}
              />
            </td>
            <td>
              <div className='notes-container'>
                <textarea
                  id='deployment'
                  className='notes-textarea'
                  onChange={(event) =>
                    handleTextarea('deployment', event?.target.value)
                  }
                ></textarea>
              </div>
            </td>
          </tr>
          <tr className='border'>
            <td>
              {format('evaluation_schema.requirement_specification.label')}
            </td>
            <td className='td-row-details'>
              <table className='main-table'>
                <tbody>
                  <tr>
                    <td className='td-row-details td-full-width border-none'>
                      <table className='main-table '>
                        <tbody>
                          {transformedData?.map((item, indexKey) => {
                            if (
                              item.requirementSpecificationCompliance
                                .crossCuttingRequirements.length ||
                              item.requirementSpecificationCompliance
                                .functionalRequirements.length
                            ) {
                              return (
                                <tr
                                  key={`details-divided-cell-values-${item}-${indexKey}`}
                                  className=''
                                >
                                  <td className={classNames('border-none')}>
                                    <div className='td-bb-image-name-container'>
                                      <BBImage imagePath={item.bbName} />
                                      <p>{format(item.bbName)}</p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className='td-row-details'>
              <table className='main-table'>
                <tbody>
                  <tr>
                    <td className='td-row-details td-full-width border-none'>
                      <table className='main-table '>
                        <tbody>
                          {transformedData?.map((item, indexKey) => {
                            if (
                              item.requirementSpecificationCompliance
                                .crossCuttingRequirements.length ||
                              item.requirementSpecificationCompliance
                                .functionalRequirements.length
                            ) {
                              return (
                                <tr
                                  key={`details-divided-cell-values-${item}-${indexKey}`}
                                  className=''
                                >
                                  <td className={classNames('border-none')}>
                                    <CustomSelect
                                      options={[
                                        {
                                          value: `requirement-${item.bbName}`,
                                          label: format(
                                            'evaluation_schema.level_1.label'
                                          ),
                                        },
                                        {
                                          value: `requirement-${item.bbName}`,
                                          label: format(
                                            'evaluation_schema.level_2.label'
                                          ),
                                        },
                                        {
                                          value: `requirement-${item.bbName}`,
                                          label: format('table.N/A.label'),
                                        },
                                      ]}
                                      onChange={handleOnSelect}
                                      placeholder={format('app.select.label')}
                                    />
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className='td-row-details'>
              <table className='main-table'>
                <tbody>
                  <tr>
                    <td className='td-row-details td-full-width border-none'>
                      <table className='main-table'>
                        <tbody>
                          {transformedData?.map((item, indexKey) => {
                            if (
                              item.requirementSpecificationCompliance
                                .crossCuttingRequirements.length ||
                              item.requirementSpecificationCompliance
                                .functionalRequirements.length
                            ) {
                              return (
                                <tr
                                  key={`details-divided-cell-values-${item}-${indexKey}`}
                                  className=''
                                >
                                  <td className={classNames('border-none')}>
                                    <div className='notes-container'>
                                      <textarea
                                        id={`requirement-${item.bbName}`}
                                        className='notes-textarea'
                                        onChange={(event) =>
                                          handleTextarea(
                                            `requirement-${item.bbName}`,
                                            event?.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr className='border'>
            <td>{format('table.interface_compliance.label')}</td>
            <td className='td-row-details'>
              <table className='main-table'>
                <tbody>
                  <tr>
                    <td className='td-row-details td-full-width border-none'>
                      <table className='main-table '>
                        <tbody>
                          {transformedData?.map((item, indexKey) => {
                            if (item.interfaceCompliance.requirements.length) {
                              return (
                                <tr
                                  key={`details-divided-cell-values-${item}-${indexKey}`}
                                >
                                  <td
                                    className={classNames('border-none', {
                                      'border-bottom': indexKey === 1,
                                    })}
                                  >
                                    <div className='td-bb-image-name-container'>
                                      <BBImage imagePath={item.bbName} />
                                      <p>{format(item.bbName)}</p>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className='td-row-details'>
              <table className='main-table'>
                <tbody>
                  <tr>
                    <td className='td-row-details td-full-width border-none'>
                      <table className='main-table'>
                        <tbody>
                          {transformedData?.map((item, indexKey) => {
                            if (item.interfaceCompliance.requirements.length) {
                              return (
                                <tr
                                  key={`details-divided-cell-values-${item}-${indexKey}`}
                                >
                                  <td
                                    className={classNames('border-none', {
                                      'border-bottom': indexKey === 1,
                                    })}
                                  >
                                    <CustomSelect
                                      options={[
                                        {
                                          value: `interface-${item.bbName}`,
                                          label: format(
                                            'evaluation_schema.level_1.label'
                                          ),
                                        },
                                        {
                                          value: `interface-${item.bbName}`,
                                          label: format(
                                            'evaluation_schema.level_2.label'
                                          ),
                                        },
                                        {
                                          value: `interface-${item.bbName}`,
                                          label: format('table.N/A.label'),
                                        },
                                      ]}
                                      onChange={handleOnSelect}
                                      placeholder={format('app.select.label')}
                                    />
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td className='td-row-details'>
              <table className='main-table'>
                <tbody>
                  <tr className=''>
                    <td className='td-row-details td-full-width border-none'>
                      <table className='main-table '>
                        <tbody>
                          {transformedData?.map((item, indexKey) => {
                            if (item.interfaceCompliance.requirements.length) {
                              return (
                                <tr
                                  key={`details-divided-cell-values-${item}-${indexKey}`}
                                  className=''
                                >
                                  <td
                                    className={classNames('border-none', {
                                      'border-bottom': indexKey === 1,
                                    })}
                                  >
                                    <div className='notes-container'>
                                      <textarea
                                        id={`interface-${item.bbName}`}
                                        className='notes-textarea'
                                        onChange={(event) =>
                                          handleTextarea(
                                            `interface-${item.bbName}`,
                                            event?.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <div className='table-action-buttons'>
        <Button
          type='button'
          text={format('app.save.label')}
          styles='secondary-button'
          onClick={() => onAction(updatedFormValues, 'update')}
          showCheckIcon={savedFormState[data.formDetails[0].id]}
        />
        <Button
          type='button'
          text={format('form.reject.label')}
          styles='primary-red-button'
          onClick={() => onAction(updatedFormValues, 'reject')}
        />
        <Button
          type='button'
          text={format('form.accept.label')}
          styles='primary-button'
          onClick={() => onAction(updatedFormValues, 'accept')}
        />
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ComplianceDetailTable;
