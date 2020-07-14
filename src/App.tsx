import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import memoize from 'lodash/memoize';
// import * as anime from 'animejs/lib/anime.es.js';
import { useSpring, animated } from 'react-spring';

import Arc from './Arc';
import Svg from './Svg';
import SunBurst from './SunBurst';

import { subject as generateSubject } from './data/generator';
import biology from './data/subjects/biology';
import russian from './data/subjects/russian';
import geometry from './data/subjects/geometry';
import chemistry from './data/subjects/chemistry';

const subjects = {
  name: 'All subjects',
  children: [biology, russian, geometry, chemistry],
};

const subjectData = generateSubject(subjects);
// const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, subjects.children.length + 1));

// console.log(subjectData);

const partition = (data: any) => {
  const root = d3
    .hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => (b.value || 0) - (a.value || 0));
  return d3.partition().size([2 * Math.PI, root.height + 1])(root);
};

const root = partition(subjectData) as any;
// root.each((d: any) => (d.current = d));

const groupNodesByLevel = (node: any, acc: any = [], level: number = 0) => {
  if (!acc[level]) acc[level] = [];
  acc[level].push(node);
  if (node.children)
    node.children.forEach((child: any) => {
      groupNodesByLevel(child, acc, level + 1);
    });

  return acc;
};

const nodesByLevel = groupNodesByLevel(root);
// console.log(nodesByLevel);

const resolveInnerRadius = (tall: number, short: number, index: number, padding = 3) => {
  if (index <= 2) return tall * index + padding * index;
  return tall * 3 + short * (index - 2) + padding * index;
};

const xScale = d3.scaleLinear();
// const yScale = d3.scaleSqrt();

const handleSubjectShange = (params: any) => (p: any) => {
  const { setNodes, setLevel } = params;

  return (e: Event) => {
    // parent.datum(p.parent || root);
    e.stopPropagation();

    let xDomain = [p.x0, p.x1];
    console.log(xDomain);
    // let yDomain = [p.y0, 1];
    let xRange = [0, 2 * Math.PI];
    console.log(xRange);
    // let yRange = [p.y0 ? 20 : 0, 100];

    xScale.domain(xDomain).range(xRange);

    // anime({
    //   targets: {min: p.x0, max: p.x1},
    //   // translateX: 270,
    //   // delay: 1000,
    //   direction: 'alternate',
    //   loop: 3,
    //   easing: 'easeInOutCirc',
    //   update: function(anim) {
    //     console.group(anim);
    //     // updates++;
    //     // progressLogEl.value = 'progress : ' + Math.round(anim.progress) + '%';
    //     // updateLogEl.value = 'updates : ' + updates;
    //   },
    // });
    // yScale.domain(yDomain).range(yRange);

    if (p.depth < 3) {
      setNodes(groupNodesByLevel(p));
      setLevel(1);
    }

    console.log(p.data.name, p);
  };
};

const getColorName = (depth: number, d: any) => {
  if (depth === 0) return '#212122'; //top circle is always black
  if (d.data.color) return d3.color(d.data.color)?.darker((depth * depth * depth) / 10); //subject, subject area, subject topic have the same color
  return '#00b800'; // modules, outer rims
};

const renderArcGroups = memoize((groups: any, tall: number, short: number, handleSubjectShange): any => {
  let res: JSX.Element[] = [];

  if (groups.length === 7) groups.splice(-4, 1);

  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i] as any;
    const innerRadius = resolveInnerRadius(tall, short, i);
    const outerRadius = i < 3 ? innerRadius + tall : innerRadius + short;

    if (i > 0 && i < 3)
      res.push(
        <circle
          key={`shadow-${i}`}
          cx={0}
          cy={0}
          r={outerRadius + 3}
          style={{ fill: 'black', filter: 'url(#shadow)' }}
        />,
      );

    group.forEach((d: any, index: number) =>
      res.push(
        <Arc
          key={`${i}-${index}`}
          fill={getColorName(i, d)}
          // startAngle={d.target ? d.target.x0 : d.x0}
          startAngle={Math.max(0, Math.min(2 * Math.PI, xScale(d.x0)))}
          // endAngle={d.target ? d.target.x1 : d.x1}
          endAngle={Math.max(0, Math.min(2 * Math.PI, xScale(d.x1)))}
          innerRadius={innerRadius}
          outerRadius={i === 0 ? outerRadius + 10 : outerRadius}
          padAngle={0.01 * (1 / i)}
          onClick={handleSubjectShange(d)}
        />,
      ),
    );
  }

  return res;
});

export default function App() {
  //initial draw
  //onClick -> change parent & animate scale
  //

  const tall = window.innerHeight / root.height - 100;
  const short = 7;

  const [nodes, setNodes] = useState(nodesByLevel);
  const [level, setLevel] = useState(0);

  // useEffect(() => {
  //   console.log({ nodes });
  //   console.log(xScale(1));
  //   // anime()
  // }, [level]);

  return (
    <div
      onClick={e => {
        setNodes(nodesByLevel);
        setLevel(0);
      }}
    >
      <Svg height={window.innerHeight} width={window.innerWidth} style={{ background: '#eee' }}>
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="15" stdDeviation="12" floodColor="rgba(21, 0, 51, 0.21)" />
            <feDropShadow dx="0" dy="19" stdDeviation="38" floodColor="rgba(21, 0, 51, 0.25)" />
          </filter>
        </defs>

        {/* {renderArcGroups(nodes, tall, short, handleSubjectShange({ setNodes, setLevel }))} */}
        <SunBurst root={root} size={window.innerWidth / 8} />
      </Svg>
    </div>
  );
}
