import React from 'react';
import { sortBy } from "lodash";

import Item from './Item';


const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENT: list => sortBy(list, 'num_comments').reverse(),
  POINT: list => sortBy(list, 'points').reverse(),
};


const List = React.memo( ({ list, onRemoveItem }) => {
	const [sort, setSort] = React.useState({
		sortKey: "NONE",
		isReverse: false,
	});

	const handleSort = sortKey => {
		const isReverse = sort.sortKey === sortKey && !sort.isReverse;

		setSort({sortKey: sortKey, isReverse: isReverse});
	};

	const sortFunction = SORTS[sort.sortKey];
	const sortedList = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);

	return (
    console.log("B: List") || (
      <div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "40%" }}>
            <button type="button" onClick={() => handleSort("TITLE")}>
              Title
            </button>
          </span>
          <span style={{ width: "30%" }}>
            <button type="button" onClick={() => handleSort("AUTHOR")}>
              Author
            </button>
          </span>
          <span style={{ width: "10%" }}>
            <button type="button" onClick={() => handleSort("COMMENT")}>
              Comments
            </button>
          </span>
          <span style={{ width: "10%" }}>
            <button type="button" onClick={() => handleSort("POINT")}>
              Points
            </button>
          </span>
          <span style={{ width: "10%" }}>Actions</span>
        </div>

        {sortedList.map((item) => (
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        ))}
      </div>
    )
  );
});

export default List;