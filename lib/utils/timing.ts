export function timeoutPromise(
    promise: Promise<any>,
    timeoutSeconds: number,
    errorMsg?: string
): Promise<any> {
    let timer: NodeJS.Timeout
    const timeout = new Promise(
        (_, reject) =>
            (timer = setTimeout(
                () => reject(new Error(errorMsg || 'Request timeout')),
                timeoutSeconds * 1000
            ))
    )

    return Promise.race([promise.finally(() => clearTimeout(timer)), timeout])
}
