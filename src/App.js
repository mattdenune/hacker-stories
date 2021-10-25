import React from 'react';

function App() {

  function getTitle(title) {
    return title
  }
  return (
    <div className="App">
      <h1>Hello {getTitle('React')}</h1>
      <label htmlFor="search">Search: </label>
      <input id='search' type="text" />
    </div>
  );
}

export default App;
