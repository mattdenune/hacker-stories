import React, { useState, useEffect, useReducer } from "react";

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
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter((story) => action.payload.objectID !== story.objectID);
    default:
      throw new Error();
  }
};

function App() {

  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const getAsyncStories = () => 
    new Promise(resolve =>
      setTimeout(
        () =>  resolve({data: {stories: initialStories}}), 2000
      ) 
    )

  const [searchTerm, setSearchTerm] = useSemiPersistentState('Search', 'React');
  const [stories, dispatchStories] = useReducer(storiesReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value)
  };

  const searchedStories = stories.filter( story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="App">
      <h1> My Hacker Stories</h1>

      <InputWithLabel 
        id='search'
        label='Search'
        value={searchTerm} 
        isFocused
        onInputChange={handleSearch} 
      >
        <strong>Search:</strong>
        
      </InputWithLabel>

      <hr />

      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
        <p>Loading...</p>) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
}

export default App;
