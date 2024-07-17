import React, { useState, useEffect, useCallback } from 'react';
import MultiSelectDropdown from '../shared/inputs/MultiSelectDropdown';
import { getFilters } from '../../service/serviceAPI';
import { FilterOptionsType, formatTranslationType } from '../../service/types';

interface ListOfCandidateFilter {
    filterType: string;
    onChange: (arg0: any) => void;
    placeholder: formatTranslationType;
}

interface OptionType {
    value: string;
    label: string;
    isFixed?: boolean;
}

const ListOfCandidateResultsFilter: React.FC<ListOfCandidateFilter> = ({ filterType, onChange, placeholder }) => {
  const [items, setItems] = useState<OptionType[]>([]);
  const [versions, setVersions] = useState<{ [key: string]: OptionType[] }>({});

  const processFilterData = (data: FilterOptionsType) => {
    const newItems: OptionType[] = [];
    const newVersions: { [key: string]: OptionType[] } = {};

    Object.keys(data).forEach(itemName => {
      newItems.push({ value: itemName, label: itemName, isFixed: true });

      newVersions[itemName] = data[itemName].map(version => ({
        value: version,
        label: version,
      }));
    });

    setItems(newItems);
    setVersions(newVersions);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFilters(filterType);
        if (result.status === true) {
          processFilterData(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [filterType]);

  return (
    <MultiSelectDropdown
      onChange={onChange}
      placeholder={placeholder}
      availableItems={items}
      availableVersions={versions}
    />
  );
};

export default ListOfCandidateResultsFilter;
