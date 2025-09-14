document.addEventListener('DOMContentLoaded', function(){
  const target = document.querySelector('main.home [data-i18n="map.welcome"]');
  if(!target) return;

  const fullText = target.textContent || '';
  let i = 0;
  target.textContent = '';

  function step(){
    if (i <= fullText.length){
      target.textContent = fullText.slice(0, i);
      i += 1;
      setTimeout(step, 60); // typing speed
    }
  }
  step();
});


