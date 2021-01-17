/* global hexo */

'use strict';

function details(args, content) {
    args = args.join(' ').split('@');
    var is_open = args[0] || '';
    var summary = args[1] || 'Details';
    var str = hexo.render.renderSync({text: content, engine: 'markdown'});

    if(is_open)is_open = ' open';
    summary=summary.trim();
    return `<details${is_open}><summary>${summary}</summary>${str}</details>`;
}

hexo.extend.tag.register('details', details, {ends: true});
