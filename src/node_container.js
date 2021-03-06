import {ArrayLikeOfNodes} from './types';

export class NodeContainer {
  static assert(obj) {
    assert(obj).is(assert.structure({
      cloneNode: Function,
      // getElementsByClassName would be nicer,
      // however, documentFragments only support
      // querySelectorAll and not getElementsByClassName
      querySelectorAll: Function,
      childNodes: ArrayLikeOfNodes,
      nodeType: assert.number
    }));
  }
}

/**
 * A node container just like DocumentFragment,
 * but which does not "own" the child nodes in that
 * they can belong to other nodes as parents.
 * This is important for "inplace" compile runs
 * without cloning elements.
 */
export class SimpleNodeContainer {
  constructor(nodes:ArrayLikeOfNodes) {
    this.childNodes = Array.prototype.slice.call(nodes);
    this.nodeType = -1;
  }
  cloneNode(deepClone) {
    var clonedNodes;
    if (!deepClone) {
      clonedNodes = Array.prototype.slice.call(this.childNodes);
    } else {
      clonedNodes = this.childNodes.map((node) => { return node.cloneNode(deepClone); });
    }
    return new SimpleNodeContainer(clonedNodes);
  }
  querySelectorAll(selector) {
    var res = [];
    var matchesFnNames = ['matches', 'matchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'];
    this.childNodes.forEach((node) => {
      if (matchesSelector(node, selector)) {
        res.push(node);
      }
      if (node.querySelectorAll) {
        res.push(...node.querySelectorAll(selector));
      }
    });
    return res;
  }
}

var matchesSelectorFnName = findMatchesSelectorFnName();
function findMatchesSelectorFnName() {
  var res = null;
  var el = document.createElement('div');
  ['matches', 'matchesSelector', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].forEach((fnName)=>{
      if (!res && el[fnName]) {
        res = fnName;
      }
  });
  if (!res) {
    throw new Error('matchesSelector is not supported on this platform!');
  }
  return res;
}

export function matchesSelector(node, selector) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return node[matchesSelectorFnName](selector);
}
