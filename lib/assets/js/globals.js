const IDX_STATES = {
    'NOT_FOUND': -1,
    'IGNORED': -2
};

const HEIGHT = 34;
const WIDTH = 100;
const DIVISOR = 8;

const SIDES = {
    BASE: 0,
    SUBJECT: 1,
    forEach(fn) {
        fn(this.BASE);
        fn(this.SUBJECT);
    },
    map(fn) {
        return [
            fn(this.BASE),
            fn(this.SUBJECT)
        ];
    }
};

const STATES = {
    NEW: 'new',
    DELETED: 'deleted',
    CHANGED: 'changed',
    SAME: 'same',
    IGNORED: 'ignored',
    getState(idx) {
        if (idx[SIDES.BASE] === IDX_STATES.IGNORED || idx[SIDES.SUBJECT] === IDX_STATES.IGNORED) {
            return STATES.IGNORED;
        }
        if (idx[SIDES.BASE] === IDX_STATES.NOT_FOUND) {
            return STATES.NEW;
        }
        if (idx[SIDES.SUBJECT] === IDX_STATES.NOT_FOUND) {
            return STATES.DELETED;
        }
        return idx[SIDES.BASE] === idx[SIDES.SUBJECT] ? STATES.SAME : STATES.CHANGED;
    }
};

const HoverState = {
    activeIdx: [],
    setActive(side, n) {
        this.activeIdx = DiffData.indexes.find(idx => idx[side] === n);
    },
    isActive(side, n) {
        return this.activeIdx[side] === n;
    },
    unsetActive() {
        this.activeIdx = [];
    }
}

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
    [STATES.IGNORED]: 'cccccc',
    [STATES.NEW + 'active']: 'e6f28d',
    [STATES.SAME + 'active']: 'b5fc9d',
    [STATES.DELETED + 'active']: 'ffbaba',
    [STATES.CHANGED + 'active']: 'c7c7ff',
    [STATES.IGNORED + 'active']: 'e5e5e5'
};
