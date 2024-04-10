class Node {
    constructor(args) {
        this.pid = args.pid || createVector(0, 0);
        this.p;
        this.clr = args.clr || 255;
        this.span = args.span || 8;
        this.boundaryNode = false;
        this.n = args.n
        this.water = 0;
        this.u = args.u || 0; // water in the cell that does participate in diffusion
        this.v = 0; // water that is stored in the cell and doesn't participate in diffusion
        this.newu = 0;
        this.newv = 0;
        this.frozen = false;
        this.receptive = false;
        this.nsize = args.nsize || 3;

    }

    setup() {

        // set absolute pos
        let x = this.span * this.pid.x + this.span * this.pid.y * cos(120);
        let y = this.span * this.pid.y * sin(120);
        this.p = createVector(x, y);

        // set boundary node
        if (this.pid.x == 0 || this.pid.x == this.n * 2 ||
            this.pid.y == 0 || this.pid.y == this.n * 2 ||
            this.pid.y - this.pid.x == this.n || this.pid.x - this.pid.y == this.n) {
            this.boundaryNode = true;
        }

        // init water in cell
        this.water = this.u + this.v;
    }

    // gamma
    run1(gamma) {
        this.water = this.u + this.v;

        if (this.receptive) {
            this.v = this.water;
            this.u = 0;
            this.addreceptiveConstant(gamma);
            if (this.water >= 1) this.frozen = true;
        } else {
            this.v = 0;
            this.u = this.water;
        }
    }

    // diffusion
    run2(alphaa, avg) {
        if (!this.frozen) this.diffusion(alphaa, avg);
    }

    // boundary node
    run3(beta) {
        if (this.boundaryNode) this.newu = beta;


        if (this.frozen) this.clr = 255;
        else {
            this.clr = 100;
        }
    }


    update() {
        this.u = this.newu;
        this.v = this.newv;
    }

    draw() {
        push();
        translate(this.p.x, this.p.y);
        stroke(this.clr);
        strokeWeight(this.nsize)
        point(0, 0);
        // fill(255)
        // noStroke();
        // text(this.water.toFixed(2), 3, 10);
        pop();
    }

    addreceptiveConstant(gamma) {
        this.newv = this.v + gamma;
    }

    diffusion(alphaa, avg) {
        this.newu = this.u + alphaa * (avg - this.u) / 2;
    }





}