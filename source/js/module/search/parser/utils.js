export function highlight(text, regexp){
  text = text || '';
  return text.replace(regexp, '<span class="search-key-word">$&</span>');
}