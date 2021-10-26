import React, { useState, useEffect } from "react";

import List from './components/List';
import InputWithLabel from "./components/InputWithLabel";

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState );

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue]
}

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
  
  const [stories, setStories] = useState([]);

  useEffect(() => {
    getAsyncStories()
      .then(result => {
        setStories(result.data.stories)
      })
  }, [])

  const handleRemoveStory = (objectID) => {
    const newStories = stories.filter((story) => objectID !== story.objectID);

    setStories(newStories);
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

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  );
}

export default App;
