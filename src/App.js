import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';

import List from './components/List';
import SearchForm from "./components/SearchForm";
import styles from  './style/App.module.css';

const useSemiPersistentState = (key, initialState) => {
  const isMounted = React.useRef(false);
  
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState );

  useEffect(() => {
    if ( !isMounted.current) {
      isMounted.current = true;
    } else {
      console.log("A")
      localStorage.setItem(key, value);
    }
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

const getSumComments = stories => {
  console.log('C: getComments()');

  return stories.data.reduce(
    (result, value) => result + value.num_comments,
    0
  );
};

const getUrl = searchTerm => `${API_ENDPOINT}${searchTerm}`;

const getLastSearches = urls => 
  urls
    .reduce((result, url, index) => {
      const searchTerm = extractSearchTerm(url);

      if (index === 0) {
        return result.concat(searchTerm);
      }

      const previousSearchTerm = result[result.length -1];

      if (searchTerm === previousSearchTerm) {
        return result;
      } else {
        return result.concat(searchTerm);
      }
    }, [])
    .slice(-6)
    .slice(0, -1)

const extractSearchTerm = url => url.replace(API_ENDPOINT, "");

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('Search', 'React');
  const [urls, setUrls] = React.useState([getUrl(searchTerm)]);
  const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], isLoading: false, isError: false });

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const lastUrl = urls[urls.length -1 ]
      const result = await axios.get(lastUrl);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  },[urls]);


  useEffect(() => {
    handleFetchStories();
  },[handleFetchStories]);

  const handleRemoveStory = React.useCallback(item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  },[]);

  const handleSearchInput = event => {
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = event => {
    setSearchTerm(searchTerm);

    handleSearch(searchTerm);

    event.preventDefault();
  }

  console.log('B: App')
  
  const sumComments = React.useMemo( () => 
  getSumComments(stories),[stories]);

  const handleLastSearch = searchTerm => {
    handleSearch(searchTerm);
  };

  const handleSearch = searchTerm => {
    const url = getUrl(searchTerm);
    setUrls(urls.concat(url));
  }

  const lastSearches = getLastSearches(urls);
  
  // console.log("🚀 ~ file: App.js ~ line 133 ~ App ~ stories.data", stories.data)
  
  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>
        My Hacker Stories with {sumComments} comments.
      </h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      
      {lastSearches.map((searchTerm, index) => (
        <button 
          key={searchTerm + index} 
          type="button" 
          onClick={() => handleLastSearch(searchTerm)}
        >
          {searchTerm}
        </button>
      ))}
      
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
