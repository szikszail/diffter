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
        ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
        this.items.sort((i1, i2) => {
            if (i2.isActive()) {
                return -1;
            }
            if (i1.isActive()) {
                return 1;
            }
            return 0;
        })
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
