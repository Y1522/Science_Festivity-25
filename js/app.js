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

// Keep outdoor/conference card order fixed on language change
document.addEventListener('languageChanged', function(){
  var container = document.querySelector('.image-container[style*="margin-top:14px"]');
  if(!container) return;
  var cards = container.querySelectorAll('div[style*="position:relative"]');
  if(cards.length === 2){
    cards[0].style.order = '1';
    cards[1].style.order = '2';
    container.style.direction = 'ltr';
  }
});


