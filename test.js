#!/usr/bin/env node

const fs = require('fs')
const commonmark = require('commonmark');
const sourcemap  = require('source-map');

const reader = new commonmark.Parser();

const sourceFile = 'test.md'
const source = fs.readFileSync(sourceFile, 'utf8')
const parsed = reader.parse(source)
console.log(compile(parsed).toStringWithSourceMap())

function compile(node) {
  const chunks = []
  console.log(node.type, node.sourcepos, node.isContainer);

  if (node.isContainer) {
    for (var child = node.firstChild; child != null; child = child.next) {
      chunks.push(compile(child));
    }
    return new sourcemap.SourceNode( node.sourcepos[0][0], node.sourcepos[0][1]
                                   , sourceFile
                                   , chunks
                                   )
  }
  console.log(node.type, node.sourcepos, node.isContainer, node.literal);
  if (node.literal) return node.literal
  return ""
}

