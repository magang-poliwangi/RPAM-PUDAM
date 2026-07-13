import { ActionType } from "./action";

function kajiUlangRisikosReducer(kajiUlangRisikos = [], action = {}) {
    switch (action.type) {
        case ActionType.RECEIVE_KAJI_ULANG_RISIKOS:
            return action.payload.kajiUlangRisikos;

        case ActionType.ADD_KAJI_ULANG_RISIKO:
            return [...kajiUlangRisikos, action.payload.kajiUlangRisiko];

        case ActionType.UPDATE_KAJI_ULANG_RISIKO:
            return kajiUlangRisikos.map((item) => (
                item.id === action.payload.kajiUlangRisiko.id
                    ? { ...item, ...action.payload.kajiUlangRisiko }
                    : item
            ));

        case ActionType.DELETE_KAJI_ULANG_RISIKO:
            return kajiUlangRisikos.filter((item) => item.id !== action.payload.id);

        default:
            return kajiUlangRisikos;
    }
}

export default kajiUlangRisikosReducer;
