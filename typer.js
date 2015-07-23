var Typer = function(element) {
  console.log("constructor called");
  this.element = element;
  var delim = element.dataset.delim || ","; // default to comma
  var words = element.dataset.words || "sample typing";
  this.words = words.split(delim).filter(function(v){return v;}); // non empty words
  this.delay = element.dataset.delay || 200;
  this.deleteDelay = element.dataset.deleteDelay || 800;

  this.progress = { word:0, char:0, building:true, atWordEnd:false };
  this.typing = true;

  this.doTyping();
};

Typer.prototype.start = function() {
  if (!this.typing) {
    this.typing = true;
    this.doTyping();
  }
};
Typer.prototype.stop = function() {
  this.typing = false;
};
Typer.prototype.doTyping = function() {
  var e = this.element;
  var p = this.progress;
  var w = p.word;
  var c = p.char;
  var currentChar = this.words[w][c];
  p.atWordEnd = false;
  if (p.building) {
    e.innerHTML += currentChar;
    p.char += 1;
    if (p.char == this.words[w].length) {
      p.building = false;
      p.atWordEnd = true;
    }
  } else {
    e.innerHTML = e.innerHTML.slice(0, -1);
    if (!this.element.innerHTML) {
      p.building = true;
      p.word = (p.word + 1) % this.words.length;
      p.char = 0;
    }
  }
  var myself = this;
  setTimeout(function() {
    if (myself.typing) { myself.doTyping(); };
  }, p.atWordEnd ? this.deleteDelay : this.delay);
};

typers = {};
elements = document.getElementsByClassName("typer");
for (var i = 0, e; e = elements[i++];) {
  typers[e.id] = new Typer(e);
}
elements = document.getElementsByClassName("typer-stop");
for (var i = 0, e; e = elements[i++];) {
  var owner = typers[e.dataset.owner];
  e.onclick = function(){owner.stop();};
}
elements = document.getElementsByClassName("typer-start");
for (var i = 0, e; e = elements[i++];) {
  var owner = typers[e.dataset.owner];
  e.onclick = function(){owner.start();};
}