import React, { useState, useEffect } from "react";

import List from './components/List';
import Search from "./components/Search";

function App() {

  const stories = [
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

  const [searchTerm, setSearchTerm] = useState(localStorage.getItem('search') || "React");

  const handleSearch = event => {
    setSearchTerm(event.target.value)
  };

  const searchedStories = stories.filter( story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    localStorage.setItem('search', searchTerm)
  }, [searchTerm])

  return (
    <div className="App">
      <h1> My Hacker Stories</h1>

      <Search search={searchTerm} onSearch={handleSearch} />      

      <hr />

     <List list={searchedStories} />
    </div>
  );
}

export default App;
