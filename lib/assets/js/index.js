class ListDiff extends React.Component {
    render() {
        return React.createElement(DiffTable);
    }
}

ReactDOM.render(
    React.createElement(ListDiff),
    document.getElementById('root')
);

ReactDOM.render(
    React.createElement(ReactTooltip, {
        place: 'bottom',
        type: 'light',
        effect: 'solid',
        multiline: true,
        className: 'diffter-tooltip',
        html: true
    }),
    document.getElementById('tooltip')
);