import React from 'react';

export default function Square(props) {
  return (
    <button
      className={"square " + props.className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
