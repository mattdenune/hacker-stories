import React from 'react';

const InputWithLabel = ({ 
	id, 
	label, 
	value, 
	type = 'text',
	onInputChange, 
}) => {
  return (
    <>
      <label htmlFor={id}>{label} </label>
      &nbsp;
      <input 
				id={id} 
				type={type} 
				value={value} 
				onChange={onInputChange} 
			/>
    </>
  );
};

export default InputWithLabel;
