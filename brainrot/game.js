// ===== STEAL A BRAINROT — MODULE LOADER =====
// data.js is already loaded by index.html; this loads the rest in order.
(function(){
  var files=['core.js','guard.js','play1.js','actions.js','botai.js','shops.js','hud.js','draw1.js','draw2.js','main.js'];
  var i=0;
  function next(){
    if(i>=files.length){
      if(typeof setupTouch==='function'){setupTouch();}
      return;
    }
    var s=document.createElement('script');
    s.src=files[i++];
    s.onload=next;
    s.onerror=function(){console.error('failed '+s.src);next();};
    document.head.appendChild(s);
  }
  next();
})();
