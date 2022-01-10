import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios'

import List from './components/List';
import InputWithLabel from "./components/InputWithLabel";

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue]
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      }
    default:
      throw new Error();
  }
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('Search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);
  const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;
  
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
  
    fetch(url)
      .then(response => response.json())
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
      })
      .catch(() => 
        dispatchStories({ type: 'STORIES_FETCH_FAILURE'})
      );
  }, [url]);


  useEffect(() => {
    handleFetchStories();
  },[handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearchInput = event => {
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  }

  return (
    <div className="App">
      <h1> My Hacker Stories</h1>

      <InputWithLabel 
        id='search'
        label='Search'
        value={searchTerm} 
        isFocused
        onInputChange={handleSearchInput} 
      >
        <strong>Search:</strong>
        
      </InputWithLabel>

      <button
        type='button'
        disabled={!searchTerm}
        onClick={handleSearchSubmit}>
        submit
      </button>

      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;
