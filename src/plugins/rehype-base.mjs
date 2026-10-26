import { withBase } from '../lib/paths.mjs';

// Raw HTML in .md remains a string in Unified's tree. Only rewrite quoted
// root-relative URL attributes; fenced code is a different node and is untouched.
export function remarkBase({ base = '/' } = {}) {
  return (tree) => {
    function walk(node) {
      if (node.type === 'html') {
        node.value = node.value.replace(
          /(\b(?:src|href|poster|data)\s*=\s*)(["'])(\/(?!\/)[^"']*)\2/gi,
          (_, start, quote, path) => `${start}${quote}${withBase(path, base)}${quote}`,
        );
      }
      node.children?.forEach(walk);
    }
    walk(tree);
  };
}

// MDX's reusable media components call the URL helper directly.
export default function rehypeBase({ base = '/' } = {}) {
  return (tree) => {
    function walk(node) {
      if (node.type === 'element' && node.properties) {
        for (const key of ['href', 'src', 'poster', 'data']) {
          if (typeof node.properties[key] === 'string') {
            node.properties[key] = withBase(node.properties[key], base);
          }
        }
      }
      node.children?.forEach(walk);
    }
    walk(tree);
  };
}
