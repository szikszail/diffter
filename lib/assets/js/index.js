const IDX_STATES = {
    'NOT_FOUND': -1,
    'IGNORED': -2
};

const HEIGHT = 34;
const WIDTH = 100;
const DIVISOR = 8;

const STATES = {
    NEW: 'new',
    DELETED: 'deleted',
    CHANGED: 'changed',
    SAME: 'same',
    IGNORED: 'ignored',
    getState(idx) {
        if (idx[0] === IDX_STATES.IGNORED || idx[1] === IDX_STATES.IGNORED) {
            return STATES.IGNORED;
        }
        if (idx[0] === IDX_STATES.NOT_FOUND) {
            return STATES.NEW;
        }
        if (idx[1] === IDX_STATES.NOT_FOUND) {
            return STATES.DELETED;
        }
        return idx[0] === idx[1] ? STATES.SAME : STATES.CHANGED;
    }
};

const STROKE_COLORS = {
    [STATES.NEW]: 'adcc00',
    [STATES.SAME]: '007d08',
    [STATES.DELETED]: 'a80000',
    [STATES.CHANGED]: '0d00c7',
    [STATES.IGNORED]: '7d7d7d'
};
const FILL_COLORS = {
    [STATES.NEW]: 'cee61c',
    [STATES.SAME]: '6bfa3c',
    [STATES.DELETED]: 'ff7575',
    [STATES.CHANGED]: '8f8fff',
    [STATES.IGNORED]: 'cccccc'
};

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

class DiffHeader extends React.Component {
    render() {
        return React.createElement('div', {className: 'diff-header'}, this.props.text);
    }
}

class DiffItem extends React.Component {
    render() {
        return React.createElement('div', {
            className: ['diff-item'].concat(this.props.className || []).join(' '),
            title: this.props.text
        }, this.props.text);
    }
}

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
        return this.getCoordinates(this.idx[0]);
    }

    getRight() {
        return this.getCoordinates(this.idx[1]);
    }

    _setColor() {
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = hexToRgbString(STROKE_COLORS[this.state]);
        this.ctx.fillStyle = hexToRgbString(FILL_COLORS[this.state]);
    }

    _renderLeftCircle() {
        const l = this.getLeft();
        this.ctx.beginPath();
        this.ctx.moveTo(l.left, l.top);
        this.ctx.arc(
            l.left, l.middle,
            l.middle - l.top,
            -Math.PI/2, Math.PI/2
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
            -Math.PI/2, Math.PI/2,
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
        switch(this.state) {
            case STATES.NEW:
                this._renderRightCircle();
                break;
            case STATES.DELETED:
                this._renderLeftCircle();
                break;
            case STATES.IGNORED:
                if (this.idx[0] !== IDX_STATES.IGNORED) {
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

class DiffCanvas extends React.Component {
    constructor(props) {
        super(props);

        this.items = DiffData.indexes.map(idx => new CanvasItem(idx));
    }

    componentDidMount() {
        this.updateCanvas();
    }

    updateCanvas() {
        const ctx = this.refs.canvas.getContext('2d');
        this.items.forEach(item => item.render(ctx));
    }

    render() {
        return React.createElement('canvas', {
            ref: 'canvas',
            width: this.props.width,
            height: this.props.height
        });
    }
}

class DiffTable extends React.Component {
    constructor(props) {
        super(props);

        this.data = DiffData;
        this.length = Math.max(
            DiffData.baseList.items.length,
            DiffData.subjectList.items.length
        );
    }

    getBaseDiff(n) {
        const idx = this.data.indexes.find(i => i[0] === n);
        if (!idx) {
            console.error(`Diff indexes cannot be found for base item #${n}`);
            return [];
        }
        return idx;
    }

    getSubjectDiff(n) {
        const idx = this.data.indexes.find(i => i[1] === n);
        if (!idx) {
            console.error(`Diff indexes cannot be found for subject item #${n}`);
            return [];
        }
        return idx;
    }

    getNumbers() {
        return Array.from(
            {length: this.length},
            (_, i) => React.createElement(DiffItem, {text: i+1})
        );
    }

    getBaseItems() {
        return this.data.baseList.items.map((item, i) => {
            const state = STATES.getState(this.getBaseDiff(i));
            return React.createElement(DiffItem, {
                text: item.title,
                className: `state-${state}`
            });
        });
    }

    getSubjectItems() {
        return this.data.subjectList.items.map((item, i) => {
            const state = STATES.getState(this.getSubjectDiff(i));
            return React.createElement(DiffItem, {
                text: item.title,
                className: `state-${state}`
            });
        });
    }

    render() {
        return React.createElement(
            'div', {className: 'diff-table'},
            React.createElement(
                'div', {className: 'diff-column-number'},
                React.createElement(DiffHeader, {text: '#'}),
                ...this.getNumbers()
            ),
            React.createElement(
                'div', {className: 'diff-column-items column-base'},
                React.createElement(DiffHeader, {
                    text: this.data.baseList.title
                }),
                ...this.getBaseItems()
            ),
            React.createElement(
                'div', {className: 'diff-column-canvas'},
                React.createElement(DiffHeader, {text: '...'}),
                React.createElement(DiffCanvas, {
                    width: 100,
                    height: this.length * HEIGHT
                })
            ),
            React.createElement(
                'div', {className: 'diff-column-items column-subject'},
                React.createElement(DiffHeader, {
                    text: this.data.subjectList.title
                }),
                ...this.getSubjectItems()
            )
        )
    }
}

class ListDiff extends React.Component {
    render() {
        return React.createElement(DiffTable);
    }
}
