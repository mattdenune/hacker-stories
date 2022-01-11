import React from 'react';

import Item from './Item';


const List = ({ list, onRemoveItem }) =>
	console.log('B: List') || 
  list.map((item) => (
	<Item 
		key={item.objectID} 
		item={item}
		onRemoveItem={onRemoveItem}
	/>
	)
)

export default List;