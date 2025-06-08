import { HTTPError } from "ky";

/**
 * Represents the outcome of an operation that can either succeed or fail.
 * It is a tuple where the first element indicates success (true) or failure (false),
 * the second element is the error (or null if successful),
 * and the third element is the data (or null if an error occurred).
 * @template T The type of the data on success.
 * @template E The type of the error on failure.
 */
type Result<T, E = Error | HTTPError> = [boolean, E | null, T | null];

/**
 * Wraps a Promise and returns a tuple [ok, error, data].
 * If the promise resolves, ok is true, error is null, and data is the resolved value.
 * If the promise rejects, ok is false, error is the rejected error, and data is null.
 * @template T The type of the data the Promise resolves to.
 * @template E The type of the error if the Promise rejects.
 * @param promise The Promise to wrap.
 * @returns A Promise that resolves to a Result tuple [ok, error, data].
 */
export function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>>;
/**
 * Wraps a synchronous function and returns a tuple [ok, error, data] as a Promise.
 * If the function executes successfully, ok is true, error is null, and data is the returned value.
 * If the function throws an error, ok is false, error is the thrown error, and data is null.
 * @template T The return type of the synchronous function.
 * @template E The type of the error if the function throws.
 * @param fn The synchronous function to wrap.
 * @returns A Promise that resolves to a Result tuple [ok, error, data].
 */
export function tryCatch<T, E = Error>(
  fn: () => T,
): Promise<Result<T, E>>;

/**
 * Executes an operation (either a Promise or a synchronous function) and returns its outcome as a tuple [ok, error, data].
 * This function provides a consistent error handling mechanism for both synchronous and asynchronous operations.
 * @template T The type of the data expected from the operation.
 * @template E The type of the error that might occur during the operation.
 * @param operation The Promise or synchronous function to execute.
 * @returns A Promise that resolves to a Result tuple: [ok, error, data].
 *          If the operation is successful, `ok` is `true`, `error` is `null`, and `data` is the result.
 *          If the operation fails, `ok` is `false`, `error` is the caught error, and `data` is `null`.
 */
export async function tryCatch<T, E = Error>(
  operation: Promise<T> | (() => T),
): Promise<Result<T, E>> {
  try {
    const data = typeof operation === 'function' ? operation() : await operation;
    return [true, null, data];
  } catch (error) {
    return [false, error as E, null];
  }
}
