# Essence

[![npm](https://img.shields.io/npm/v/hexo-theme-essence)](https://www.npmjs.com/package/hexo-theme-essence) [![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsshwy%2Fhexo-theme-essence.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsshwy%2Fhexo-theme-essence?ref=badge_shield)

Essence is a functional and darkmode featured theme for Hexo.

Visit [Sshwy's Notes](https://notes.sshwy.name) for preview.

## Features :hammer:

- :first_quarter_moon: Dark mode.
- :lock: Encrypt tag for paragraphs of your post.
- :package: Iconfont instead of font awesome. So if you need more icons you have to collect them yourself.
- :open_file_folder: Folder categorized instead of manually writing it into frontmatter.
- :cloud: Leancloud storage project for Valine.
- :iphone: Responsive layout.
- :mag: Local search.
- :gear: [prism-themes](https://github.com/PrismJS/prism-themes) supported as well as custom themes.

## Installation :inbox_tray:

You can install it via npm:

```bash
npm install hexo-theme-essence --save
```

On another hand, the traditional way is still working, which means you clone this repository under `<YourBlog>/themes/essence/`.

Whatever way you choose, please install these peer dependencies as well:

```bash
npm install hexo-renderer-stylus hexo-renderer-ejs hexo-webpack --save
```

It's worth reminding that `hexo-renderer-stylus` and `hexo-renderer-ejs` is hexo's default render engine. `hexo-webpack` is used to package and minify JavaScript scripts.

## Configuration :gear:

First of all, create a copy of [default configuration](https://github.com/sshwy/hexo-theme-essence/blob/main/_config.yml) under `<YourBlog>/`, renaming it to `_config.essence.yml`. 

After that, you can follow the comments to modify it just as you want :smile:.

If you use traditional way to install, you can also modify `<YourBlog>/themes/essence/_config.yml` directly. However it is not recommended.

## Contributing :fountain_pen:

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License :page_facing_up:

View [LICENSE.md](./LICENSE.md) for detailed information.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsshwy%2Fhexo-theme-essence.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsshwy%2Fhexo-theme-essence?ref=badge_large)
