interface graphResponse {
    head: {
        vars: Array<string>
    },
    results: {
        bindings: Array<{
            [key: string]: {type: string, value: string | float | int}
        }>
    }
}