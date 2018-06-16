const setActive = (item, active) => {
    if (item) {
        item.setState({ active });
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

        this.numbers = this.getNumbers();
        this.items = SIDES.map(side => this.getItems(side));
        this.canvas = React.createRef();
    }

    updateCanvas() {
        this.canvas.current.updateCanvas();
    }

    updateActive(active) {
        SIDES.forEach(side => {
            const i = HoverState.activeIdx[side];
            if (i >= 0 && i < this.items[side].length) {
                setActive(this.items[side][i].ref.current, active);
            }
        });
    }

    getDiff(side, n) {
        const idx = this.data.indexes.find(i => i[side] === n);
        if (!idx) {
            console.error(`Diff indexes cannot be found for ${side ? 'subject' : 'base'} item #${n}`);
            return [];
        }
        return idx;
    }

    getNumbers() {
        return Array.from(
            { length: this.length },
            (_, i) => React.createElement('div', {
                className: 'diff-item'
            }, i + 1)
        );
    }

    getItems(side) {
        return this.data[side ? 'subjectList' : 'baseList'].items.map((item, index) => {
            const component = {
                ref: React.createRef()
            };

            const state = STATES.getState(this.getDiff(side, index));
            component.element = React.createElement(DiffItem, {
                text: item.title,
                ref: component.ref,
                side, index, state,
                metadata: item.metadata,
                updateCanvas: this.updateCanvas.bind(this),
                updateActive: this.updateActive.bind(this, true),
                removeActive: this.updateActive.bind(this, false)
            });

            return component;
        });
    }

    render() {
        return React.createElement(
            'div', { className: 'diff-table' },
            React.createElement(
                'div', { className: 'diff-column-number' },
                React.createElement(DiffHeader, { text: '#' }),
                ...this.numbers
            ),
            React.createElement(
                'div', { className: 'diff-column-items column-base' },
                React.createElement(DiffHeader, {
                    text: this.data.baseList.title
                }),
                ...this.items[SIDES.BASE].map(item => item.element)
            ),
            React.createElement(
                'div', { className: 'diff-column-canvas' },
                React.createElement(DiffHeader, { text: '...' }),
                React.createElement(DiffCanvas, {
                    ref: this.canvas,
                    width: 100,
                    height: this.length * HEIGHT
                })
            ),
            React.createElement(
                'div', { className: 'diff-column-items column-subject' },
                React.createElement(DiffHeader, {
                    text: this.data.subjectList.title
                }),
                ...this.items[SIDES.SUBJECT].map(item => item.element)
            )
        )
    }
}