import React from 'react';

import styles from '../style/Item.module.css'

const Item = ({ item, onRemoveItem }) => {

	const handleRemoveItem = () => {
		onRemoveItem(item);
	};

	return (
    <div className={styles.item}>
      <span style={{ width: "40%" }}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width: "30%" }}>{item.author}</span>
      <span style={{ width: "10%" }}>{item.num_comments}</span>
      <span style={{ width: "10%" }}>{item.points}</span>
      <button type="button" onClick={handleRemoveItem} className={`${styles.button} ${styles.bottonSmall}`}>
        Dismiss
      </button>
    </div>
  );
}

export default Item
