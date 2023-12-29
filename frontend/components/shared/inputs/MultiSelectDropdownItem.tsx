import React from 'react';

type RowItem = {
  id: string,
  name: string
}

type DropDownItem = {
  item: RowItem,
  isSelected: boolean,
  onSelectItem: () => void
}

const DropdownItem = ({ item, isSelected, onSelectItem }: DropDownItem) => {
  return (
    <div onClick={onSelectItem} style={{ backgroundColor: isSelected ? 'blue' : 'white' }}>
      {item.name} {/* Assuming each item has a 'name' property */}
    </div>
  );
};

export default DropdownItem;
