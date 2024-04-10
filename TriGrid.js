class TriGrid {
    constructor(args) {
        this.nodes = args.nodes;
    }

    run() {
        this.nodes.forEach(nrow => {
            nrow.filter(n => n != null).forEach(n => {
                if (n.water >= 1) {
                    n.receptive = true;
                }
                if (this.isReceptive(n)) {
                    n.receptive = true;
                }
            })
        })
    }

    getBoundaryAvg(center) {
        let sum = 0;
        this.nodes.forEach(nrow => {
            nrow.filter(n => n != null).forEach(n => {
                if (this.isNeighbor(center, n)) {
                    sum += n.u;
                }
            })
        })
        return sum / 6;
    }

    isNeighbor(center, other) {
        let nei = false;
        if (other.pid.x == center.pid.x - 1 && other.pid.y == center.pid.y - 1) nei = true;
        else if (other.pid.x == center.pid.x - 1 && other.pid.y == center.pid.y) nei = true;
        else if (other.pid.x == center.pid.x && other.pid.y == center.pid.y - 1) nei = true;
        else if (other.pid.x == center.pid.x && other.pid.y == center.pid.y + 1) nei = true;
        else if (other.pid.x == center.pid.x + 1 && other.pid.y == center.pid.y) nei = true;
        else if (other.pid.x == center.pid.x + 1 && other.pid.y == center.pid.y + 1) nei = true;
        else nei = false;
        return nei;
    }

    isReceptive(center) {
        let receptive = false;
        this.nodes.forEach(nrow => {
            nrow.filter(n => n != null).forEach(n => {
                if (this.isNeighbor(center, n)) {
                    if (n.water >= 1) receptive = true;
                }
            })
        })
        return receptive;

    }
}