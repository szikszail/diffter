
const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const hexToRgbString = hex => {
    const result = hexToRgb(hex);
    return result ? `rgb(${result.r},${result.g},${result.b})` : '';
};

class CanvasItem {
    constructor(idx) {
        this.idx = idx;
        this.state = STATES.getState(idx);
    }

    getCoordinates(n) {
        const top = n * HEIGHT;
        return {
            bX: WIDTH / DIVISOR,
            bY: HEIGHT / DIVISOR,
            top,
            middle: top + HEIGHT / 2,
            bottom: top + HEIGHT,
            left: 0,
            center: WIDTH / 2,
            right: WIDTH
        };
    }

    getLeft() {
        return this.getCoordinates(this.idx[SIDES.BASE]);
    }

    getRight() {
        return this.getCoordinates(this.idx[SIDES.SUBJECT]);
    }

    isActive() {
        return HoverState.activeIdx.join(',') === this.idx.join(',');
    }

    _setColor() {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = hexToRgbString(STROKE_COLORS[this.state]);

        if (this.isActive()) {
            this.ctx.fillStyle = hexToRgbString(FILL_COLORS[this.state + 'active']);
        } else {
            this.ctx.fillStyle = hexToRgbString(FILL_COLORS[this.state]);
        }
    }

    _renderLeftCircle() {
        const l = this.getLeft();
        this.ctx.beginPath();
        this.ctx.moveTo(l.left, l.top);
        this.ctx.arc(
            l.left, l.middle,
            l.middle - l.top,
            -Math.PI / 2, Math.PI / 2
        );
        this.ctx.lineTo(l.left, l.top);
        this.ctx.stroke();
        this.ctx.fill();
    }

    _renderRightCircle() {
        const r = this.getRight();
        this.ctx.beginPath();
        this.ctx.moveTo(r.right, r.top);
        this.ctx.arc(
            r.right, r.middle,
            r.middle - r.top,
            -Math.PI / 2, Math.PI / 2,
            true
        );
        this.ctx.lineTo(r.right, r.top);
        this.ctx.stroke();
        this.ctx.fill();
    }

    _renderBezierBar() {
        const l = this.getLeft();
        const r = this.getRight();
        this.ctx.beginPath();
        this.ctx.moveTo(l.left, l.top);
        this.ctx.bezierCurveTo(
            l.center - l.bX, l.top,
            l.center + l.bX, r.top,
            r.right, r.top
        );
        this.ctx.lineTo(r.right, r.bottom);
        this.ctx.bezierCurveTo(
            l.center + l.bX, r.bottom,
            l.center - l.bX, l.bottom,
            l.left, l.bottom
        );
        this.ctx.lineTo(l.left, l.top);
        this.ctx.stroke();
        this.ctx.fill();
    }

    _renderBezierRectangle() {
        const l = this.getLeft();
        this.ctx.beginPath();
        this.ctx.moveTo(l.left, l.top);
        this.ctx.bezierCurveTo(
            l.left + l.bX, l.top,
            l.center - l.bX, l.top + l.bY,
            l.center, l.top + l.bY
        );
        this.ctx.bezierCurveTo(
            l.center + l.bX, l.top + l.bY,
            l.right - l.bX, l.top,
            l.right, l.top
        );
        this.ctx.lineTo(l.right, l.bottom);
        this.ctx.bezierCurveTo(
            l.right - l.bX, l.bottom,
            l.center + l.bX, l.bottom - l.bY,
            l.center, l.bottom - l.bY
        );
        this.ctx.bezierCurveTo(
            l.center - l.bX, l.bottom - l.bY,
            l.left + l.bX, l.bottom,
            l.left, l.bottom
        );
        this.ctx.lineTo(l.left, l.top);
        this.ctx.stroke();
        this.ctx.fill();
    }

    render(ctx) {
        this.ctx = ctx;
        this._setColor();
        switch (this.state) {
            case STATES.NEW:
                this._renderRightCircle();
                break;
            case STATES.DELETED:
                this._renderLeftCircle();
                break;
            case STATES.IGNORED:
                if (this.idx[SIDES.BASE] !== IDX_STATES.IGNORED) {
                    this._renderLeftCircle();
                } else {
                    this._renderRightCircle();
                }
                break;
            case STATES.CHANGED:
                this._renderBezierBar();
                break;
            case STATES.SAME:
                this._renderBezierRectangle();
                break;
        }
    }
}
