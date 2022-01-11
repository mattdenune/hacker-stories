import React from 'react'

import InputWithLabel from './InputWithLabel';
import styles from '../style/SearchForm.module.css';

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => {
  return (
      <form onSubmit={onSearchSubmit} className={styles.searchForm}>
        <InputWithLabel
          id="search"
          label="Search"
          value={searchTerm}
          isFocused
          onInputChange={onSearchInput}
        >
          <strong>Search:</strong>
        </InputWithLabel>

        <button type="submit" disabled={!searchTerm} className={`${styles.button} ${styles.buttonLarge}`}>
          Search
        </button>
      </form>
  );
}

export default SearchForm
