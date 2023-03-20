import React, { useRef, useEffect } from 'react';

import styles from '../style/InputWithLabel.module.css';

const InputWithLabel = ({ 
	id, 
	value, 
	type = 'text',
	onInputChange, 
	isFocused,
	children
}) => {

	const inputRef = useRef();

	useEffect(() => {
		if (isFocused && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isFocused])
  return (
    <>
      <label htmlFor={id} className={styles.label}>
				{children} 
			</label>
      &nbsp;
      <input 
				ref={inputRef}
				id={id} 
				type={type} 
				value={value} 
				autoFocus={isFocused}
				onChange={onInputChange} 
				className={styles.input}
			/>

    </>
  );
};

export default InputWithLabel;
