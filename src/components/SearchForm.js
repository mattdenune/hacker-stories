import React from 'react'

import InputWithLabel from './InputWithLabel';

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => {
  return (
      <form onSubmit={onSearchSubmit}>
        <InputWithLabel
          id="search"
          label="Search"
          value={searchTerm}
          isFocused
          onInputChange={onSearchInput}
        >
          <strong>Search:</strong>
        </InputWithLabel>

        <button type="submit" disabled={!searchTerm}>
          Search
        </button>
      </form>
  );
}

export default SearchForm
