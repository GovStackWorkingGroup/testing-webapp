import React, { useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { RiQuestionLine } from 'react-icons/ri';
import classNames from 'classnames';
import {
  FormStatusOptions,
  RequirementsType,
  SoftwareDetailsTypeCompliance,
  SpecificationComplianceLevelOptions,
} from '../../service/types';
import useTranslations from '../../hooks/useTranslation';
import { SoftwareDetailsDataType } from '../../service/types';
import BBImage from '../BuildingBlocksImage';
import CustomSelect, { OptionsType } from '../shared/inputs/Select';
import Button from '../shared/buttons/Button';
import { StatusEnum } from '../../service/constants';

type ComplianceDetailTable = {
  data: SoftwareDetailsDataType | undefined;
  savedFormState: { [key: string]: boolean };
  handleOpenEvaluationSchemaModal: (value: boolean) => void;
  handleFormAction: (
    data: ComplianceDetailFormValuesType[],
    type: 'update' | 'accept' | 'reject'
  ) => Promise<void>;
  detailItem: SoftwareDetailsTypeCompliance;
};

export type ComplianceDetailFormValuesType = {
  id: string;
  bbName: string;
  deploymentCompliance: {
    level: SpecificationComplianceLevelOptions;
    notes: string;
  };
  interfaceCompliance: {
    requirements: RequirementsType[];
    notes: string;
    level: SpecificationComplianceLevelOptions;
  };
  requirementSpecificationCompliance: {
    crossCuttingRequirements: RequirementsType[];
    functionalRequirements: RequirementsType[];
    notes: string;
    level: SpecificationComplianceLevelOptions;
  };
};

const ComplianceDetailTable = ({
  data,
  savedFormState,
  handleOpenEvaluationSchemaModal,
  handleFormAction,
  detailItem,
}: ComplianceDetailTable) => {
  const [updatedFormValues, setUpdatedFormValues] =
    useState<ComplianceDetailFormValuesType[]>();
  const complianceFormStatus: FormStatusOptions = detailItem.status;
  const isInReviewStatus = complianceFormStatus === StatusEnum.IN_REVIEW;
  const isInApprovedStatus = complianceFormStatus === StatusEnum.APPROVED;

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

      setUpdatedFormValues(newData);
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
        const updatedArray = formValues.map((item) => {
          return {
            ...item,
            deploymentCompliance: {
              ...item.deploymentCompliance,
              level,
              notes: item.deploymentCompliance.notes,
            },
          };
        });

        setUpdatedFormValues(updatedArray);

        return;
      }

      if (index.startsWith('interface')) {
        const updatedArray = formValues.map((item) => {
          if (item.bbName === indexBB) {
            return {
              ...item,
              interfaceCompliance: {
                ...item.interfaceCompliance,
                level,
                note: item.interfaceCompliance.notes,
              },
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
              requirementSpecificationCompliance: {
                ...item.requirementSpecificationCompliance,
                level,
                note: item.requirementSpecificationCompliance.notes,
              },
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
        const updatedArray = formValues.map((item) => {
          return {
            ...item,
            deploymentCompliance: {
              ...item.deploymentCompliance,
              level: item.deploymentCompliance.level,
              notes: value,
            },
          };
        });

        setUpdatedFormValues(updatedArray);

        return;
      }

      if (index.startsWith('interface')) {
        const updatedArray = formValues.map((item) => {
          if (item.bbName === indexBB) {
            return {
              ...item,
              interfaceCompliance: {
                ...item.interfaceCompliance,
                level: item.interfaceCompliance.level,
                notes: value,
              },
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
              requirementSpecificationCompliance: {
                ...item.requirementSpecificationCompliance,
                level: item.requirementSpecificationCompliance.level,
                notes: value,
              },
            };
          }

          return item;
        });
        setUpdatedFormValues(updatedArray);

        return;
      }
    }
  };

  return updatedFormValues?.length ? (
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
                isDisabled={!isInReviewStatus}
                value={{
                  value: 'deployment',
                  label:
                    updatedFormValues[0].deploymentCompliance.level === -1
                      ? format('table.N/A.label')
                      : format(
                          `evaluation_schema.level_${updatedFormValues[0].deploymentCompliance.level}.label`
                      ),
                }}
                placeholder={format('app.select.label')}
              />
            </td>
            <td>
              <div className='notes-container'>
                <textarea
                  id='deployment'
                  className='notes-textarea'
                  disabled={!isInReviewStatus}
                  onChange={(event) =>
                    handleTextarea('deployment', event?.target.value)
                  }
                  value={updatedFormValues[0].deploymentCompliance.notes}
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
                          {updatedFormValues?.map((item, indexKey) => {
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
                          {updatedFormValues?.map((item, indexKey) => {
                            if (
                              item.requirementSpecificationCompliance
                                .crossCuttingRequirements.length ||
                              item.requirementSpecificationCompliance
                                .functionalRequirements.length
                            ) {
                              const formattedLabel =
                                item.requirementSpecificationCompliance
                                  .level === -1
                                  ? format('table.N/A.label')
                                  : format(
                                      `evaluation_schema.level_${item.requirementSpecificationCompliance.level}.label`
                                  );

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
                                      isDisabled={!isInReviewStatus}
                                      value={{
                                        value: `requirement-${item.bbName}`,
                                        label: formattedLabel,
                                      }}
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
                          {updatedFormValues?.map((item, indexKey) => {
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
                                        disabled={!isInReviewStatus}
                                        value={
                                          item[
                                            'requirementSpecificationCompliance'
                                          ].notes
                                        }
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
                          {updatedFormValues?.map((item, indexKey) => {
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
                          {updatedFormValues?.map((item, indexKey) => {
                            if (item.interfaceCompliance.requirements.length) {
                              const formattedLabel =
                                item.interfaceCompliance.level === -1
                                  ? format('table.N/A.label')
                                  : format(
                                      `evaluation_schema.level_${item.interfaceCompliance.level}.label`
                                  );

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
                                      isDisabled={!isInReviewStatus}
                                      value={{
                                        value: `interface-${item.bbName}`,
                                        label: formattedLabel,
                                      }}
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
                          {updatedFormValues?.map((item, indexKey) => {
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
                                        disabled={!isInReviewStatus}
                                        value={
                                          item['interfaceCompliance'].notes
                                        }
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
        {isInReviewStatus && (
          <>
            <Button
              type='button'
              text={format('app.save.label')}
              styles='secondary-button'
              onClick={() => onAction(updatedFormValues, 'update')}
              showCheckIcon={savedFormState[data?.formDetails[0].id || 0]}
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
          </>
        )}
        {isInApprovedStatus && (
          <div className='approved-box'> {format('table.accepted')} </div>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ComplianceDetailTable;
