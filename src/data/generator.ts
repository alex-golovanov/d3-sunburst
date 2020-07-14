import cloneDeep from 'lodash/cloneDeep';
import range from 'lodash/range';
import * as d3 from 'd3';

type JSONValue = string | number | boolean | JSONObject | JSONArray | string[];

interface JSONObject {
  [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

interface SubjectTree {
  name: string;
  children: JSONArray;
  // relatedSubjects?: string[];
}

const random = function(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function generateModules(leaf: any): any {
  let res: any[] = [];
  const moduleCount = random(1, 3);

  for (let i = 0; i < moduleCount; i++) {
    res.push(generateBranch({}, 2, random(0, 2)));
  }

  return res;
}

function generateBranch(res: any, currentLevel: number, levelCount: number): any {
  res = {
    name: 'Level ' + currentLevel + ' module',
    level: currentLevel,
    value: levelCount ? 0 : 1,
  };

  if (levelCount) res.children = [generateBranch(res, currentLevel + 1, levelCount - 1)];

  return res;
}

export function subject(data: any) {
  const clone = cloneDeep(data);
  const subjects = clone.children || [];

  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, subjects.length + 1));

  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];
    subject.color = color(subject.name);
    if (!subject.children) subject.children = [{ name: subject.name, children: [] }];

    const areas = subject.children;
    for (let j = 0; j < areas.length; j++) {
      const area = areas[j];

      area.color = subject.color;
      if (!area.children) area.children = [{ name: area.name, children: [] }];

      const topics = area.children;
      for (let k = 0; k < topics.length; k++) {
        const topic = topics[k];
        topic.color = subject.color;
        topic.children = generateModules(topic);
      }
    }
  }

  return clone;
}
