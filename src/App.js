import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';

import List from './components/List';
import SearchForm from "./components/SearchForm";
import LastSearches from './components/lastSearches'
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
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: 
          action.payload.page === 0
            ? action.payload.list
            : state.data.concat(action.payload.list),
        page: action.payload.page,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
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

const getUrl = (searchTerm, page) => 
  `${API_BASE}${API_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`;


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

const extractSearchTerm = url => 
  url
    .substring(url.lastIndexOf('?') + 1, url.lastIndexOf('&'))
    .replace(PARAM_SEARCH, "");

const API_BASE = 'https://hn.algolia.com/api/v1';
const API_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';

function App() {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('Search', 'React');
  const [urls, setUrls] = React.useState([getUrl(searchTerm, 0)]);
  const [stories, dispatchStories] = useReducer(storiesReducer, { data: [], page: 0, isLoading: false, isError: false });

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const lastUrl = urls[urls.length -1 ]
      const result = await axios.get(lastUrl);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: {
          list: result.data.hits,
          page: result.data.page,
        },
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
    handleSearch(searchTerm, 0);

    event.preventDefault();
  }

  console.log('B: App')
  
  const sumComments = React.useMemo( () => 
  getSumComments(stories),[stories]);

  const handleLastSearch = searchTerm => {
    setSearchTerm(searchTerm);

    handleSearch(searchTerm, 0);
  };

  const handleSearch = (searchTerm, page) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));
  }

  const lastSearches = getLastSearches(urls);

  const handleMore = () => {
    const lastUrl = urls[urls.length - 1];
    const searchTerm = extractSearchTerm(lastUrl);
    handleSearch(searchTerm, stories.page + 1);
  }
  
  console.log("🚀 ~ file: App.js ~ line 133 ~ App ~ stories.data", stories.data)
  
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
      
      <LastSearches
        lastSearches={lastSearches}
        onLastSearch={handleLastSearch}
      />
      
      {stories.isError && <p>Something went wrong...</p>}

      <List list={stories.data} onRemoveItem={handleRemoveStory} />
      
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <button type='button' onClick={handleMore}>
          More
        </button>
      )}

    </div>
  );
}

export default App;
