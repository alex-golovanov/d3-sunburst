import * as React from 'react';
import styled from 'styled-components';

interface StageProps {
  children: JSX.Element[] | JSX.Element;
  height: number;
  width: number;
  className?: any;
  style: any;
}

const Svg = styled.svg`
  &.shadow {
    filter: drop-shadow(0px 3px 2px rgba(0, 0, 0, 1));
  }
`;

const Stage: React.FC<StageProps> = ({ children, width = 100, height = 100, ...rest }) => {
  const x = width / 2;
  const y = height / 2;
  return (
    <Svg {...rest} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <g transform={`translate(${x},${y})`}>{children}</g>
    </Svg>
  );
};

export default Stage;
