export const REMOTE_CLIPPY_PORT_ENV: string = "REMOTE_CLIPPY_PORT";

export function getPort(): number {
    if (!process.env[REMOTE_CLIPPY_PORT_ENV]) {
        throw new Error(`Environment variable ${REMOTE_CLIPPY_PORT_ENV} is not set.`);
    }
    return parseInt(process.env[REMOTE_CLIPPY_PORT_ENV]!);
}