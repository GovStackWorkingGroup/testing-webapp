import { RiSearchLine } from 'react-icons/ri';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import { useCallback } from 'react';

const AsyncReactSelect = dynamic(() => import('react-select/async'), {
  ssr: false,
});

type Props = {
  value?: string;
  name: string;
};

const SearchInput = ({ value, name,...otherProps }: Props) => {
  const { formatMessage } = useIntl();
  const format = useCallback(
    (id: string) => formatMessage({ id }),
    [formatMessage]
  );

  return (
    <div className='search-input-container'>
      <AsyncReactSelect
        {...otherProps}
        cacheOptions
        inputId={`async-select-id-${name}`}
        value={value}
        placeholder={format('app.search')}
        unstyled
        classNames={{
          dropdownIndicator: () => 'search-dropdown-indicator',
          valueContainer: () => 'search-value-container',
          placeholder: () => 'search-placeholder',
          container: () => 'search-container',
          menuList: () => 'search-menu-list',
          option: () => 'search-option',
          input: () => 'search-input',
          menu: () => 'search-menu',
        }}
      />
      <div className='search-input-loupe'>
        <RiSearchLine />
      </div>
    </div>
  );
};

export default SearchInput;
