export default function(howMany) {
  return new RegExp(`(\\.\\d{${howMany || 3}})\\d*`, 'g');
}
