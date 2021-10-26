import React from 'react';

const Item = ({ 
		url,
		title,
		author,
		num_comments,
		points,
		onRemoveItem,
		objectID
}) => {

	const handleRemoveItem = () => {
		onRemoveItem(objectID);
	};

	return (
    <div>
      <span>
        <a href={url}>{title}</a>
      </span>
      <span>{author}</span>
      <span>{num_comments}</span>
      <span>{points}</span>
			<button
				type='button'
				onClick={handleRemoveItem}>
				Dismiss
			</button>
    </div>
  );
}

export default Item
