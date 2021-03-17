export function persistState(reducerModule: string, update: any) {
    try {
        let state: any = {};
        const serializedState = localStorage.getItem('persistedState');
        if (serializedState !== null) {
            state = JSON.parse(serializedState);
        }
        state[reducerModule] = state[reducerModule] || {};
        Object.assign(state[reducerModule], update);
        localStorage.setItem('persistedState', JSON.stringify(state));
    } catch (err) {
        // empty
    }
}

export function getPersistedState(reducerModule: string) {
    let persistedState: any = {};
    try {
        const serializedState = localStorage.getItem('persistedState');
        if (serializedState !== null) {
            persistedState = JSON.parse(serializedState);
            if (persistedState.reducerModule !== null) {
                return persistedState[reducerModule];
            }
        }
    } catch (err) {
        // empty
    }

    return {};
}
