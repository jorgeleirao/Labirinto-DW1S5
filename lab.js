var Position = function(x, y) {
  this.x = x;
  this.y = y;
}

Position.prototype.toString = function() {
  return this.x + ":" + this.y;
};

var Lab = function(id) {

  this.labirintoContainer = document.getElementById(id);

  this.labirintoScore = document.createElement("div");
  this.labirintoScore.id = "labirinto_score";

  this.labirintoMessage = document.createElement("div");
  this.labirintoMessage.id = "labirinto_message";

  this.heroScore = this.labirintoContainer.getAttribute("data-steps") - 2;

  this.labirinto = [];
  this.heroPos = {};
  this.heroHasKey = false;
  this.childMode = false;

  this.utter = null;

  for(i=0; i < this.labirintoContainer.children.length; i++) {
    for(j=0; j < this.labirintoContainer.children[i].children.length; j++) {
      var el =  this.labirintoContainer.children[i].children[j];
      this.labirinto[new Position(i, j)] = el;
      if(el.classList.contains("entrance")) {
        this.heroPos = new Position(i, j);
        this.labirinto[this.heroPos].classList.add("hero");
      }
    }
  }

  var labirintoOutputDiv = document.createElement("div");
  labirintoOutputDiv.id = "labirinto_output";

  labirintoOutputDiv.appendChild(this.labirintoScore);
  labirintoOutputDiv.appendChild(this.labirintoMessage);

  labirintoOutputDiv.style.width = this.labirintoContainer.scrollWidth + "px";
  this.setMessage("Procure a saída!");

  this.labirintoContainer.insertAdjacentElement("afterend", labirintoOutputDiv);


  this.keyPressHandler = this.labirintoKeyPressHandler.bind(this);
  document.addEventListener("keydown", this.keyPressHandler, false);
};

Lab.prototype.enableSpeech = function() {
  this.utter = new SpeechSynthesisUtterance()
  this.setMessage(this.labirintoMessage.innerText);
};

Lab.prototype.setMessage = function(text) {

  this.labirintoMessage.innerHTML = text;
  this.labirintoScore.innerHTML = this.heroScore;

};

Lab.prototype.heroTakeTreasure = function() {
  this.labirinto[this.heroPos].classList.remove("nubbin");
  this.heroScore += 10;
  this.setMessage("Você encontrou tesouro!");
};

Lab.prototype.heroTakeKey = function() {
  this.labirinto[this.heroPos].classList.remove("key");
  this.heroHasKey = true;
  this.heroScore += 20;
  this.labirintoScore.classList.add("has-key");
  this.setMessage("Você encontrou a chave!");
};

Lab.prototype.gameOver = function(text) {
  /* Desativa os controles quando o jogo termina */
  document.removeEventListener("keydown", this.keyPressHandler, false);
  this.setMessage(text);
  this.labirintoContainer.classList.add("finished");
};

Lab.prototype.heroWins = function() {
  this.labirintoScore.classList.remove("has-key");
  this.labirinto[this.heroPos].classList.remove("door");
  this.heroScore += 50;
  this.gameOver("Você completou o labirinto!");
};

Lab.prototype.tryMoveHero = function(pos) {

  if("object" !== typeof this.labirinto[pos]) {
    return;
  }

  var nextStep = this.labirinto[pos].className;


  if(nextStep.match(/sentinel/)) {
    this.heroScore = Math.max(this.heroScore - 5, 0);

    if(!this.childMode && (this.heroScore <= 0)) {
      this.gameOver("Você não conseguiu completar o labirinto...");
    } else {
      this.setMessage("oof ouchie owie");
    }

    return;
  }

  if(nextStep.match(/wall/)) {
    return;
  }

  if(nextStep.match(/exit/)) {
    if(this.heroHasKey) {
      this.heroWins();
    } else {
      this.setMessage("Você precisa de uma chava para destrancar a porta!");
      return;
    }
  }


  this.labirinto[this.heroPos].classList.remove("hero");
  this.labirinto[pos].classList.add("hero");
  this.heroPos = pos;


  if(nextStep.match(/nubbin/)) {
    this.heroTakeTreasure();
    return;
  }

  if(nextStep.match(/key/)) {
    this.heroTakeKey();
    return;
  }

  if(nextStep.match(/exit/)) {
    return;
  }

  if((this.heroScore >= 1) && !this.childMode) {

    this.heroScore--;

    if(this.heroScore <= 0) {
      this.gameOver("Você não conseguiu completar o labirinto...");
      return;
    }

  }

  this.setMessage("...");

};

Lab.prototype.labirintoKeyPressHandler = function(e) {

  var tryPos = new Position(this.heroPos.x, this.heroPos.y);

  switch(e.key)
  {
    case "ArrowLeft":
      this.labirintoContainer.classList.remove("face-right");
      tryPos.y--;
      break;

    case "ArrowUp":
      tryPos.x--;
      break;

    case "ArrowRight":
      this.labirintoContainer.classList.add("face-right");
      tryPos.y++;
      break;

    case "ArrowDown":
      tryPos.x++;
      break;

    default:
      return;

  }

  this.tryMoveHero(tryPos);

  e.preventDefault();
};

Lab.prototype.setChildMode = function() {
  this.childMode = true;
  this.heroScore = 0;
  this.setMessage("Colete todo o tesouro");
};