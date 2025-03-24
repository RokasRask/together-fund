import * as A from '../Constants/actions.js';

export default function ideasReducer(state, action) {
    switch (action.type) {
        case A.LOAD_ALL_IDEAS:
            return action.payload; // Grąžiname visas idėjas iš serverio
        default:
            return state;
    }
}