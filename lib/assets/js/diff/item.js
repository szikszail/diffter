class DiffItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: HoverState.isActive(this.props.side, this.props.index)
        };
        console.log(this.props);
    }

    mouseOver() {
        HoverState.setActive(this.props.side, this.props.index);
        this.props.updateActive();
        this.props.updateCanvas();
    }

    mouseOut() {
        this.props.removeActive();
        HoverState.unsetActive();
        this.props.updateCanvas();
    }

    getToolTipContent() {
        let content = `<p><span class="state state-${this.props.state}">${this.props.state.toUpperCase()}</span></p>`
            + `<p>${this.props.text}</p>`;
        const metaKeys = Object.keys(this.props.metadata || {});
        if (metaKeys.length) {
            content += '<ul>';
            metaKeys.forEach(key => {
                if (this.props.metadata[key]) {
                    content += `<li><strong>${key}</strong>: ${this.props.metadata[key]}</li>`;
                }
            });
            content += '</ul>';
        }
        return content;
    }

    render() {
        const classes = ['diff-item', `state-${this.props.state}`];
        if (this.state.active) {
            classes.push('active');
        }
        return React.createElement(
            'div',
            {
                className: classes.join(' '),
                'data-tip': this.getToolTipContent(),
                onMouseOver: this.mouseOver.bind(this),
                onMouseOut: this.mouseOut.bind(this)
            },
            this.props.text
        );
    }
}