import test from 'node:test';
import assert from 'node:assert/strict';
import { withBase } from '../src/lib/paths.mjs';
import rehypeBase, { remarkBase } from '../src/plugins/rehype-base.mjs';

test('root and repository sites preserve hashes, queries and encoded filenames', () => {
  assert.equal(withBase('/notes/hello/', '/'), '/notes/hello/');
  assert.equal(withBase('/', '/blog/'), '/blog/');
  assert.equal(
    withBase('/media/%E7%AC%94%E8%AE%B0.pdf#page=2', '/blog/'),
    '/blog/media/%E7%AC%94%E8%AE%B0.pdf#page=2',
  );
  assert.equal(withBase('/notes/?tag=Markdown', 'blog'), '/blog/notes/?tag=Markdown');
});
test('prefixes are not duplicated or confused with similar repository names', () => {
  assert.equal(withBase('/blog/notes/', '/blog'), '/blog/notes/');
  assert.equal(withBase('/blogger/notes/', '/blog'), '/blog/blogger/notes/');
  assert.equal(withBase('/blog#top', '/blog'), '/blog#top');
});
test('remote media, mail, data URLs, relative images and anchors stay intact', () => {
  for (const value of [
    'https://example.com/video.mp4',
    '//cdn.example.com/img.png',
    'mailto:hello@example.com',
    '#标题',
    './picture.png',
    'data:image/png;base64,abc',
  ])
    assert.equal(withBase(value, '/blog'), value);
});
test('Markdown image/link and HTML media URLs adapt to project Pages', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'element',
        properties: { src: '/images/a.svg', href: '/notes/a/', poster: '/images/p.png' },
        children: [{ type: 'element', properties: { data: '/media/a.pdf' } }],
      },
    ],
  };
  rehypeBase({ base: '/blog' })(tree);
  assert.equal(tree.children[0].properties.src, '/blog/images/a.svg');
  assert.equal(tree.children[0].children[0].properties.data, '/blog/media/a.pdf');
  const raw = {
    type: 'root',
    children: [
      {
        type: 'html',
        value:
          '<video controls src="/media/a.mp4" poster=\'/images/p.png\'></video><a href="https://example.com">外链</a>',
      },
      { type: 'code', value: '<iframe src="/media/a.pdf"></iframe>' },
    ],
  };
  remarkBase({ base: '/blog' })(raw);
  assert.equal(
    raw.children[0].value,
    '<video controls src="/blog/media/a.mp4" poster=\'/blog/images/p.png\'></video><a href="https://example.com">外链</a>',
  );
  assert.equal(raw.children[1].value, '<iframe src="/media/a.pdf"></iframe>');
});
