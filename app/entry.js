class Random {
    static randInt(n) {
        return parseInt(Math.random() * n);
    }
}

class View {
    constructor(canvasElement, model, options) {
        this.canvasElement = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.model = model;
        this.options = options;

        window.onresize = this.update;
    }

    update() {
        this.canvasElement.width = this.canvasElement.clientWidth;
        this.canvasElement.height = this.canvasElement.clientHeight;
        let xRes = this.canvasElement.width / this.model.width;
        let yRes = this.canvasElement.height / this.model.height;
        for (let x = 0; x < this.model.width; x++) {
            for (let y = 0; y < this.model.height; y++) {
                if (this.model.isAlive(x, y)) {
                    this.ctx.fillStyle = 'rgb(255, 255, 255)';
                } else {
                    this.ctx.fillStyle = 'rgb(0, 0, 0)';
                }
                this.ctx.fillRect(x * xRes, y * yRes, xRes, yRes);
            }
        }
    }
}

class Model {
    constructor(width, height, options) {
        this.width = width;
        this.height = height;
        this.options = options;
        this.grid = [];
        for (let x = 0; x < width; x++) {
            let row = [];
            this.grid.push(row);
            for (let y = 0; y < height; y++) {
                row.push(false);
            }
        }
    }

    seed(count) {
        for (let i = 0; i < count; i++) {
            let x = Random.randInt(this.width);
            let y = Random.randInt(this.height);
            this.grid[x][y] = true;
        }
    }

    next() {
        let grid = [];
        for (let x = 0; x < this.width; x++) {
            let row = [];
            grid.push(row);
            for (let y = 0; y < this.height; y++) {
                let liveNeighborCount = this.countLiveNeighbors(x, y);
                let alive = false;
                if (this.isAlive(x, y)) {
                    if (liveNeighborCount >= 2 && liveNeighborCount <= 3) {
                        alive = true;
                    }
                } else if (liveNeighborCount === 3) {
                    alive = true;
                }
                row.push(alive);
            }
        }
        this.grid = grid;
    }

    isAlive(x, y) {
        return this.inBound(x, y) && this.grid[x][y];
    }

    inBound(x, y) {
        return x > 0 && y > 0 && x < this.width && y < this.height;
    }

    countLiveNeighbors(x, y) {
        let count = 0;
        count += this.isAlive(x - 1, y - 1) ? 1 : 0;
        count += this.isAlive(x - 1, y) ? 1 : 0;
        count += this.isAlive(x - 1, y + 1) ? 1 : 0;
        count += this.isAlive(x, y - 1) ? 1 : 0;
        count += this.isAlive(x, y + 1) ? 1 : 0;
        count += this.isAlive(x + 1, y - 1) ? 1 : 0;
        count += this.isAlive(x + 1, y) ? 1 : 0;
        count += this.isAlive(x + 1, y + 1) ? 1 : 0;
        return count;
    }
}

class Controller {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

    start() {

        this.view.update();
        window.setInterval(() => {
            this.model.next();
            this.view.update();
        }, 1000 / 30);
    }
}

var params = {};
var search = window.location.search;
search = search.substring(1, search.length);
search.split('&').forEach(kv => {
    let pair = kv.split('=');
    let key = pair[0];
    let value = pair.length === 2 ? pair[1] : true;
    params[key] = value;
});

let width = parseInt(params.width);
let height = parseInt(params.height);
let seed = parseInt(params.seed);

var model = new Model(width, height, {});
model.seed(seed);
var view = new View(document.getElementById('canvas'), model, {});
var controller = new Controller(view, model);

controller.start();
