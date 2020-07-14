import React from 'react';
import * as shape from 'd3-shape';
import { useSpring, animated } from 'react-spring';

const d3 = { shape };

interface ArcInterface {
  outerRadius: number;
  innerRadius: number;
  startAngle: number;
  endAngle: number;
  padRadius: number | Function;
  padAngle: number;
}

type d3Arc = string | undefined;

const arcGenerator = (props: ArcInterface): d3Arc => d3.shape.arc()(props) as d3Arc;

// const StyledPath = styled.path`
//   filter: drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.7));
// `;

// const Arc: React.FC<Partial<ArcInterface & React.SVGAttributes<T>>> = ({
const Arc = ({
  outerRadius = 50,
  innerRadius = 20,
  startAngle = 0,
  endAngle = 4,
  padRadius = 150,
  padAngle = 1,
  ...rest
}) => {
  // const style = useSpring({
  //   config: {
  //     duration: 500,
  //   },
  //   outerRadius,
  //   innerRadius,
  //   startAngle,
  //   endAngle,
  //   padRadius,
  //   padAngle,
  // });

  // console.log(style);
  return <path {...rest} d={arcGenerator({ outerRadius, innerRadius, startAngle, endAngle, padRadius, padAngle })} />;
  // return <animated.path {...rest} d={arcGenerator(style)} />;
};

export default Arc;
