import React from 'react';
import renderer from 'react-test-renderer';

import App from './App';
import InputWithLabel from './components/InputWithLabel';
import List from './components/List';
import Item from './components/Item';
import SearchForm from './components/SearchForm';


describe('Item', () => {
  const item = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  };

  const handleRemoveItem = jest.fn();

  let component;

  beforeEach(() => {
    component = renderer.create(
      <Item item={item} onRemoveItem={handleRemoveItem} />
    );
  });

  it('renders all properties', () => {
    
    expect(component.root.findByType('a').props.href).toEqual('https://reactjs.org/');

    expect(component.root.findAllByProps({ children: 'Jordan Walke'}).length).toEqual(1);

    expect(component.root.findAllByProps({ children: 3}).length).toEqual(1);

    expect(component.root.findAllByProps({ children: 4}).length).toEqual(1);

    expect(component.root.findAllByProps({ children: 'React'}).length).toEqual(1);
  });

  it('calls onRemoveItem on button click', () => {

    component.root.findByType('button').props.onClick();

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);

    expect(handleRemoveItem).toHaveBeenCalledWith(item);

    expect(component.root.findAllByType(Item).length).toEqual(1);
  });
});

describe('List', () => {
  const list = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  it('renders two items', () => {
    const component = renderer.create(<List list={list} />);

    expect(component.root.findAllByType(Item).length).toEqual(2);
    
  })
})