let n_slider, a_slider, b_slider, g_slider;
let n_p, a_p, b_p, g_p;
let start_button, pause_button;
let gameStart = false;
let gamePause = true;

var nodes = []; // save all nodes
var n = 30; // num of row
var grid; // scene of nodes
var alphaa = 3; // diffusion coefficient
var beta = 0.95; // background coefficient
var gamma = 0.0001; // vapour addition
var flakeSize = 200;

var ta, tb, tg;


function setup() {
    createCanvas(1000, 1000);
    angleMode(DEGREES);

    // create slider
    let slider_xpos = 50;
    let slider_ypos = 50;
    let slider_yspan = 30;
    n_slider = createSlider(0, 50, n, 1);
    n_slider.position(slider_xpos, slider_ypos);
    n_slider.size(100);
    n_p = createP('Grid Size(n): ' + n);
    n_p.position(n_slider.x + n_slider.width + 15, n_slider.y - 15);
    n_slider.input(updateVariable)

    a_slider = createSlider(0, 5, alphaa, 0.01);
    a_slider.position(slider_xpos, slider_ypos + slider_yspan);
    a_slider.size(100);
    a_p = createP('Diffusion Coefficient(α): ' + alphaa);
    a_p.position(a_slider.x + a_slider.width + 15, a_slider.y - 15);
    a_slider.input(updateVariable)


    b_slider = createSlider(0, 1, beta, 0.001);
    b_slider.position(slider_xpos, slider_ypos + slider_yspan * 2);
    b_slider.size(100);
    b_p = createP('Background Level(β): ' + beta);
    b_p.position(b_slider.x + b_slider.width + 15, b_slider.y - 15);
    b_slider.input(updateVariable)


    g_slider = createSlider(0, 0.1, gamma, 0.0001);
    g_slider.position(slider_xpos, slider_ypos + slider_yspan * 3);
    g_slider.size(100);
    g_p = createP('Vapour Addition(γ): ' + gamma);
    g_p.position(g_slider.x + g_slider.width + 15, g_slider.y - 15);
    g_slider.input(updateVariable)



    // create button
    start_button = createButton('Restart');
    start_button.position(slider_xpos, slider_ypos + slider_yspan * 4.5);
    start_button.mousePressed(restart);

    pause_button = createButton('Pause/Run');
    pause_button.position(slider_xpos + 70, slider_ypos + slider_yspan * 4.5);
    pause_button.mousePressed(pause);

    n = n_slider.value();
    ta = a_slider.value();
    tb = b_slider.value();
    tg = g_slider.value();
}


function draw() {

    background(0);

    fill(255);
    noStroke();
    textSize(15);
    // text('Grid Size(n)', n_slider.x + n_slider.width + 30, n_slider.y - 2);
    // text('Alpha(α): diffusion coefficient', a_slider.x + a_slider.width + 30, a_slider.y + 2);
    // text('Beta(β): background level', b_slider.x + b_slider.width + 30, b_slider.y + 5);
    // text('Gamma(γ): vapour addition', g_slider.x + g_slider.width + 30, g_slider.y + 9);

    // n = n_slider.value();
    // alphaa = a_slider.value();
    // beta = b_slider.value();
    // gamma = g_slider.value();


    push();
    translate(width / 2, height / 2 + 90);
    noFill(); // --- frame rect
    strokeWeight(0.5);
    stroke(255);
    rectMode(CENTER);
    let frameSize = flakeSize * 2.7;
    rect(0, 0, flakeSize * 2.7);
    fill(255); // --- coefficient text
    noStroke();
    textSize(15);
    text('n: ' + str(n), -frameSize / 2, -frameSize / 2 - 10);
    text('α: ' + str(ta), -frameSize / 2, frameSize / 2 + 20);
    text('β: ' + str(tb), -frameSize / 2, frameSize / 2 + 35);
    text('γ: ' + str(tg), -frameSize / 2, frameSize / 2 + 50);

    translate(flakeSize * cos(240), flakeSize * sin(240))


    if (gameStart) {

        if (!gamePause) {
            grid.run();
            grid.nodes.forEach(nrow => {
                nrow.filter(n => n != null).forEach(n => {
                    n.run1(gamma);
                })
            })

            grid.nodes.forEach(nrow => {
                nrow.filter(n => n != null).forEach(n => {
                    let avg = grid.getBoundaryAvg(n);
                    n.run2(alphaa, avg);
                    n.run3(beta);
                })
            })
        }

        grid.nodes.forEach(nrow => {
            nrow.filter(n => n != null).forEach(n => {
                n.update();
                n.draw();
            })
        })

    }
    pop();
}

function updateVariable() {
    n_p.html('Grid Size(n): ' + n_slider.value())
    a_p.html('Diffusion Coefficient(α): ' + a_slider.value())
    b_p.html('Background Level(β): ' + b_slider.value())
    g_p.html('Vapour Addition(γ): ' + g_slider.value())

}


function restart() {

    nodes = [];
    n = n_slider.value();

    // create hexagonal cells
    for (let i = 0; i < 2 * n + 1; i++) {
        nodes[i] = [];
        for (let j = 0; j < 2 * n + 1; j++) {
            let newNode = new Node({
                pid: createVector(i, j),
                n: n,
                u: beta,
                span: flakeSize / n,
                nsize: flakeSize / n / 3.5
            });

            // set grid center
            if (i == n && j == n) newNode.u = 1;

            // node setup
            newNode.setup();

            // out of range 
            if (i < n) {
                if (j > n + i) newNode = null;
            } else if (i > n) {
                if (j < i - n) newNode = null;
            }

            // add node to the list
            nodes[i].push(newNode);
        }
    }

    // create grid
    grid = new TriGrid({ nodes: nodes });

    gameStart = true;
    gamePause = false;

}

function pause() {
    gamePause = !gamePause;

    if (!gamePause) {
        alphaa = a_slider.value();
        beta = b_slider.value();
        gamma = g_slider.value();

        ta = alphaa;
        tb = beta;
        tg = gamma;
    }
}
