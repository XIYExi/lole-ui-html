

let Cursor = function(element) {
    this.element = element;
    this.cursorDisplay = element.dataset.cursordisplay || element.dataset.cursorDisplay || "|";
    element.innerHTML = this.cursorDisplay;
    this.on = true;
    element.style.transition = "all 0.1s";
    this.interval = setInterval(() => this.updateBlinkState(), 400);
}
Cursor.prototype.updateBlinkState = function() {
    if (this.on) {
        this.element.style.opacity = "0";
        this.on = false;
    } else {
        this.element.style.opacity = "1";
        this.on = true;
    }
}

let Typer = function(element) {
    this.element = element;

    /*分割*/
    let delim = element.dataset.delim || ",";

    /*设置动画的数组*/
    let words = element.dataset.words || "override these,sample typing";

    this.words = words.split(delim).filter((v) => v); // non empty words
    this.delayVariance = parseInt(element.dataset.delayVariance) || 0;
    this.delay = parseInt(element.dataset.delay) || 200;
    this.loop = element.dataset.loop || "true";

    if (this.loop === "false" ) {
        this.loop = 1
    }

    this.deleteDelay = element.dataset.deletedelay || element.dataset.deleteDelay || 800;

    this.progress = { word: 0, char: 0, building: true, looped: 0 };
    this.typing = true;

    let colors = element.dataset.colors || "black";
    this.colors = colors.split(",");
    this.element.style.color = this.colors[0];
    this.colorIndex = 0;

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
    let e = this.element;
    let p = this.progress;
    let w = p.word;
    let c = p.char;
    let currentDisplay = [...this.words[w]].slice(0, c).join("");
    let atWordEnd;
    let timeoutDelay = ((2 * Math.random() - 1) * this.delayVariance) + this.delay;
    if (this.cursor) {
        this.cursor.element.style.opacity = "1";
        this.cursor.on = true;
        clearInterval(this.cursor.interval);
        this.cursor.interval = setInterval(() => this.cursor.updateBlinkState(), 400);
    }

    e.innerHTML = currentDisplay;

    if (p.building) {
        atWordEnd = p.char === this.words[w].length;
        if (atWordEnd) {
            p.building = false;
        } else {
            p.char += 1;
        }
    } else {
        if (p.char === 0) {
            p.building = true;
            p.word = (p.word + 1) % this.words.length;
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;
            this.element.style.color = this.colors[this.colorIndex];
        } else {
            p.char -= 1;
        }
    }

    if (p.word === this.words.length - 1) {
        p.looped += 1;
    }

    if (!p.building && this.loop <= p.looped){
        this.typing = false;
    }

    setTimeout(() => {
        if (this.typing) {
            this.doTyping()
        }
    }, atWordEnd ? this.deleteDelay : timeoutDelay);
};




function TyperSetup() {
    let typers = {};
    for (let e of document.getElementsByClassName("lole-text-typer")) {
        typers[e.id] = new Typer(e);
    }
    for (let e of document.getElementsByClassName("typer-stop")) {
        let owner = typers[e.dataset.owner];
        e.onclick = () => owner.stop();
    }
    for (let e of document.getElementsByClassName("typer-start")) {
        let owner = typers[e.dataset.owner];
        e.onclick = () => owner.start();
    }
    for (let e of document.getElementsByClassName("cursor")) {
        let t = new Cursor(e);
        t.owner = typers[e.dataset.owner];
        //t.owner.cursor = t;
    }
}


