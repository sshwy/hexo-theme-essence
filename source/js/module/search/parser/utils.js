export function highlight(text, regexp){
  text = text || '';
  return text.replace(regexp, '<span class="search-key-word">$&</span>');
}

export const Weight = {
  normal: 1,
  tag: 5,
  title: 10
};