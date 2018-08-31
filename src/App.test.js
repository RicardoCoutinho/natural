import React from 'react';
import ReactDOM from 'react-dom';
import App, { handle1, handle2 } from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Function testing', () => {
  describe('when using handle1', () => {
    it('should return expected result', () => {
      expect(handle1(1)).toEqual(1);
      expect(handle1(10)).toEqual(385);
      expect(handle1(100)).toEqual(338350);
    });
  });
  describe('when using handle2', () => {
    it('should return expected result', () => {
      expect(handle2(1)).toEqual(1);
      expect(handle2(10)).toEqual(3025);
      expect(handle2(100)).toEqual(25502500);
    });
  });
});