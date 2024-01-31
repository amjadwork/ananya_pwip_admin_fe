import React, { ChangeEventHandler } from 'react';

interface ColumnFilterProps {
    column: {
      filterValue: any; 
      setFilter: (value: any) => void; 
    }
    placeholder: string;
  }
const ColumnFilter: React.FC<ColumnFilterProps> = ({ column, placeholder }) => {
  const { filterValue, setFilter } = column;
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFilter(e.target.value);
  };

  return (
    <span>
      <input
        value={filterValue || ''}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </span>
  );
};

export default ColumnFilter;
