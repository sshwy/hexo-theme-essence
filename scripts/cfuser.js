/* global hexo */

'use strict';

function codeforcesUser(args) {
    args = args.join(' ').split('@');
    var classes = args[0] || 'unr';
    var text    = args[1] || '';

    classes = classes.trim().toLowerCase();
    text = text.trim();
    !text && hexo.log.warn('Codeforces username must be defined!');
    switch(classes){
        case "lgm":
            return `<a href="https://codeforces.com/profile/${text}" target="_blank" style="text-decoration: none;"><span class="codeforces ${classes}"><strong class="lgm-head">${text[0]}</strong><strong class="lgm-tail">${text.substring(1)}</strong></span></a>`;
        case "igm":
        case "gm":
        case "im":
        case "m":
        case "cm":
        case "e":
        case "s":
            return `<a href="https://codeforces.com/profile/${text}" target="_blank" style="text-decoration: none;"><span class="codeforces ${classes}"><strong>${text}</strong></span></a>`;
        default:
            return text;
    }
}

hexo.extend.tag.register('codeforces', codeforcesUser, {ends: false});
