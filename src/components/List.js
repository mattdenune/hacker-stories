import React from 'react';

import Item from './Item';


const List = ({ list }) =>
  list.map(({ objectID, ...item }) => <Item key={objectID} {...item} />);

export default List;