import { getPayload } from "./response";

export function createAsyncOptionsLoader(
    api,
    labelSelector,
    extraParams = {}
) {
    return async (inputValue = '') => {
        const result = getPayload(
            await api.getAll({
                search: inputValue,
                limit: 20,
                ...extraParams,
            })
        );

        return (result.items || []).map((item) => ({
            value: item.id,
            label:
                typeof labelSelector === 'function'
                    ? labelSelector(item)
                    : item[labelSelector],
            raw: item,
        }));
    };
}