export default function renderKatex (options) {
  for (var i = 0; i < document.scripts.length; i++) {
    if (/math\/tex/.test(document.scripts[i].type)) {
      if (/display/.test(document.scripts[i].type)) {
        let math = document.createElement('p');
        math.setAttribute('style', 'text-align:center');
        math.setAttribute('class', 'katex-display');
        window.katex.render(document.scripts[i].text.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), math, {
          ...options,
          displayMode: true,
        });
        document.scripts[i].after(math);
        document.scripts[i].removeAttribute('type'); // avoid multi times render
      } else {
        let math = document.createElement('span');
        math.setAttribute('class', 'katex-inline');
        window.katex.render(document.scripts[i].text.replace(/&lt;/g, '<').replace(/&gt;/g, '>'), math, {
          ...options,
          displayMode: false,
        });
        document.scripts[i].after(math);
        document.scripts[i].removeAttribute('type'); // avoid multi times render
      }
    }
  }
}
export const renderKatexNoConfig = () => renderKatex({
  output: 'html',
  macros: {}, // CANT REMOVE (or it will cause render error)
});