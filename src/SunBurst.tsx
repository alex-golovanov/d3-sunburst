import * as React from 'react';
import * as d3 from 'd3';
import { Spring, animated } from 'react-spring/renderprops';

import { Group } from '@vx/group';
import { arc as d3arc } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { interpolate as d3interpolate } from 'd3-interpolate';

import Arc from './Arc';
// import Svg from './Svg';

const groupNodesByLevel = (node: any, acc: any = [], level: number = 0) => {
  if (!acc[level]) acc[level] = [];
  acc[level].push(node);
  if (node.children)
    node.children.forEach((child: any) => {
      groupNodesByLevel(child, acc, level + 1);
    });

  return acc;
};

export default class SunBurst extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    const { root, size } = props;

    console.log(size);
    const xDomain = [root.x0, root.x1];
    const xRange = [0, 2 * Math.PI];
    const innerDomain = [0, 3];
    const innerRange = [0, 240];
    const outerDomain = [4, 7];
    const outerRange = [250, 280];
    const groups = groupNodesByLevel(root);

    this.state = { xDomain, xRange, innerDomain, innerRange, groups, currentDepth: 0 };
    this.xScale.domain(xDomain).range(xRange);
    this.innerScale
      .domain(innerDomain)
      .range(innerRange)
      .clamp(true);
    this.outerScale
      .domain(outerDomain)
      .range(outerRange)
      .clamp(true);
  }

  xScale = scaleLinear();
  innerScale = scaleLinear();
  outerScale = scaleLinear();

  getColorName = (d: any, currentDepth: number) => {
    if (d.depth === 0) return '#212122'; //top circle is always black
    if (d.data.color)
      return d3
        .color(d.data.color)
        ?.darker(
          ((d.depth === 1 && currentDepth === 0) || (d.depth === 2 && currentDepth === 1) ? d.depth : d.depth * 3) / 10,
        ); //subject, subject area, subject topic have the same color
    return '#00b800'; // modules, outer rims
  };

  arc = (node: any) => {
    const innerRadius = this.innerScale(node.y0);
    const outerRadius = this.innerScale(node.y1);

    return d3arc()({
      padAngle: 0.01 * (0.75 / node.depth),
      startAngle: Math.max(0, Math.min(2 * Math.PI, this.xScale(node.x0))),
      endAngle: Math.max(0, Math.min(2 * Math.PI, this.xScale(node.x1))),
      innerRadius: node.depth > 3 ? this.outerScale(node.y0) : innerRadius,
      outerRadius:
        node.depth > 3 ? this.outerScale(node.y1) - 2 : outerRadius - 3 < innerRadius ? outerRadius : outerRadius - 3,
    });
  };

  handleClick = (d: any) => {
    console.log(d);
    if (this.state.depth === d.depth) return;

    this.setState({
      xDomain: [d.x0, d.x1],
      innerDomain: !d.parent ? [0, 3] : [1, 4],
      currentDepth: d.depth,
    });
  };

  handleUpdate = (t: any, xd: any, yd: any) => {
    this.xScale.domain(xd(t));
    this.innerScale.domain(yd(t));
  };

  renderGroups = (groups: any, t: any): any => {
    let res: JSX.Element[] = [];
    const { currentDepth } = this.state;

    res.push(<circle key={`shadow-base`} cx={0} cy={0} r={this.outerScale(4) - 9} style={{ fill: '#212122' }} />);

    for (let i = groups.length - 1; i >= 0; i--) {
      const group = groups[i] as any;

      if (((currentDepth === 0 && i > 0) || (currentDepth === 1 && i > 1)) && i < 3)
        res.push(
          <animated.circle
            key={`shadow-base-${i}`}
            cx={0}
            cy={0}
            r={t.interpolate(() => this.innerScale(i + 1))}
            style={{ fill: '#212122', filter: 'url(#shadow)' }}
          />,
        );

      group.forEach((d: any, index: number) =>
        res.push(
          <animated.path
            key={`${i}-${index}`}
            fill={this.getColorName(d, currentDepth) as string}
            d={t.interpolate(() => this.arc(d))}
            onClick={d.depth > 1 ? () => null : () => this.handleClick(d)}
          />,
        ),
      );
    }

    res.push(
      <circle
        key={`shadow-parent`}
        cx={0}
        cy={0}
        r={this.innerScale(1)}
        style={{ fill: '#212122' }}
        onClick={() => this.handleClick(groups[0][0])}
      />,
    );

    return res;
  };

  render() {
    const { size, margin = { top: 0, left: 0, right: 0, bottom: 0 } } = this.props;
    const { xDomain, innerDomain, innerRange, groups } = this.state;

    const xd = d3interpolate(this.xScale.domain(), xDomain);
    const yd = d3interpolate(this.innerScale.domain(), innerDomain);

    return (
      <Spring
        native
        reset
        from={{ t: 0 }}
        to={{ t: 1 }}
        config={{
          mass: 2,
          tension: 1000,
          friction: 100,
          precision: 0.00001,
        }}
        onFrame={({ t }: { t: any }) => this.handleUpdate(t, xd, yd)}
      >
        {({ t }: { t: any }) => {
          return (
            <Group top={size / 2} left={size / 2}>
              {this.renderGroups(groups, t)}
            </Group>
          );
        }}
      </Spring>
    );
  }
}
