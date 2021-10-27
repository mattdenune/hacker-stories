import React from 'react';

const Item = ({ item, onRemoveItem }) => {

	const handleRemoveItem = () => {
		onRemoveItem(item);
	};

	return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
			<button
				type='button'
				onClick={handleRemoveItem}>
				Dismiss
			</button>
    </div>
  );
}

export default Item
