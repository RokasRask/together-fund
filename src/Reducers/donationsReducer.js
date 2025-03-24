import * as A from '../Constants/actions';

export default function donationsReducer(state, action) {
    switch (action.type) {
        case A.LOAD_ALL_DONATIONS:
            return action.payload; // Grąžiname visas aukas iš serverio
        default:
            return state;
    }
}