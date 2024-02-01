import React, { ChangeEventHandler } from 'react';

interface GlobalFilterProps {
  filter: string | undefined;
  setFilter: (value: string | undefined) => void;
}

const GlobalFilter: React.FC<GlobalFilterProps> = ({ filter, setFilter }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFilter(e.target.value);
  };

  return (
    <span>
      Search:{' '}
      <input
        value={filter || ''}
        onChange={handleChange}
      />
    </span>
  );
};

export default GlobalFilter;
