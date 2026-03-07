import { Option, Some, None } from 'rs-option';

export interface Result<T, E> {
    isOk(): boolean;
    isErr(): boolean;
    ok(): Option<T>;
    err(): Option<E>;
    map<U>(op: (value: T) => U): Result<U, E>;
    mapOr<U>(defaultValue: U, op: (value: T) => U): U;
    mapOrElse<U>(defaultOp: (error: E) => U, op: (value: T) => U): U;
    mapErr<F>(op: (error: E) => F): Result<T, F>;
    and<U>(res: Result<U, E>): Result<U, E>;
    andThen<U>(op: (value: T) => Result<U, E>): Result<U, E>;
    or<F>(res: Result<T, F>): Result<T, F>;
    orElse<F>(op: (error: E) => Result<T, F>): Result<T, F>;
    unwrap(): T;
    unwrapOr(defaultValue: T): T;
    unwrapOrElse(op: (error: E) => T): T;
    expect(message: string): T;
    unwrapErr(): E;
    expectErr(message: string): E;
    inspect(op: (value: T) => void): Result<T, E>;
    inspectErr(op: (error: E) => void): Result<T, E>;
    flatten(this: Result<Result<T, E>, E>): Result<T, E>;
    transpose(this: Result<Option<T>, E>): Option<Result<T, E>>;
}

class OkImpl<T, E> implements Result<T, E> {
    private value: T;
    constructor(value: T) {
        this.value = value;
    }

    isOk(): boolean {
        return true;
    }

    isErr(): boolean {
        return false;
    }

    ok(): Option<T> {
        return Some(this.value);
    }

    err(): Option<never> {
        return None;
    }

    map<U>(op: (value: T) => U): Result<U, E> {
        return new OkImpl<U, E>(op(this.value));
    }

    mapOr<U>(_defaultValue: U, op: (value: T) => U): U {
        return op(this.value);
    }

    mapOrElse<U>(_defaultOp: (error: E) => U, op: (value: T) => U): U {
        return op(this.value);
    }

    mapErr<F>(_op: (error: E) => F): Result<T, F> {
        return new OkImpl(this.value);
    }

    and<U>(res: Result<U, E>): Result<U, E> {
        return res;
    }

    andThen<U, E>(op: (value: T) => Result<U, E>): Result<U, E> {
        return op(this.value);
    }

    or<F>(_res: Result<T, F>): Result<T, F> {
        return new OkImpl<T, F>(this.value);
    }

    orElse<F>(_op: (error: E) => Result<T, F>): Result<T, F> {
        return new OkImpl<T, F>(this.value);
    }

    unwrap(): T {
        return this.value;
    }

    unwrapOr(_defaultValue: T): T {
        return this.value;
    }

    unwrapOrElse(_op: (error: E) => T): T {
        return this.value;
    }

    expect(_message: string): T {
        return this.value;
    }

    unwrapErr(): never {
        throw new Error('called `unwrapErr` on an `Ok` value');
    }

    expectErr(_message: string): never {
        throw new Error('called `expectErr` on an `Ok` value');
    }

    inspect(op: (value: T) => void): Result<T, E> {
        op(this.value);
        return this;
    }

    inspectErr(_op: (error: E) => void): Result<T, E> {
        return this;
    }

    flatten(this: OkImpl<Result<T, E>, E>): Result<T, E> {
        return this.value;
    }

    transpose(this: OkImpl<Option<T>, E>): Option<Result<T, E>> {
        return this.value.map(v => new OkImpl(v));
    }

    toString(): string {
        return `Ok(${this.value})`;
    }
}

export class ErrImpl<T, E> implements Result<T, E> {
    private error: E;
    constructor(error: E) {
        this.error = error;
    }

    isOk(): boolean {
        return false;
    }

    isErr(): boolean {
        return true;
    }

    ok(): Option<never> {
        return None;
    }

    err(): Option<E> {
        return Some(this.error);
    }

    map<U>(_op: (value: T) => U): Result<U, E> {
        return new ErrImpl(this.error);
    }

    mapOr<U>(defaultValue: U, _op: (value: T) => U): U {
        return defaultValue;
    }

    mapOrElse<U>(defaultOp: (error: E) => U, _op: (value: T) => U): U {
        return defaultOp(this.error);
    }

    mapErr<F>(op: (error: E) => F): Result<T, F> {
        return new ErrImpl(op(this.error));
    }

    and<U>(_res: Result<U, E>): Result<U, E> {
        return this as unknown as ErrImpl<U, E>;
    }

    andThen<U>(_op: (value: T) => Result<U, E>): Result<U, E> {
        return this as unknown as Result<U, E>;
    }

    or<F>(res: Result<T, F>): Result<T, F> {
        return res;
    }

    orElse<F>(op: (error: E) => Result<T, F>): Result<T, F> {
        return op(this.error);
    }

    unwrap(): never {
        throw new Error('called `unwrap` on an `Err` value');
    }

    unwrapOr(defaultValue: T): T {
        return defaultValue;
    }

    unwrapOrElse(op: (error: E) => T): T {
        return op(this.error);
    }

    expect(message: string): never {
        throw new Error(message);
    }

    unwrapErr(): E {
        return this.error;
    }

    expectErr(_message: string): E {
        return this.error;
    }

    inspect(_op: (value: T) => void): Result<T, E> {
        return this;
    }

    inspectErr(op: (error: E) => void): Result<T, E> {
        op(this.error);
        return this;
    }

    flatten(this: ErrImpl<Result<T, E>, E>): Result<T, E> {
        return this as ErrImpl<T, E>;
    }

    transpose(this: ErrImpl<Option<T>, E>): Option<Result<T, E>> {
        return Some(this as ErrImpl<T, E>);
    }

    toString(): string {
        return `Err(${this.error})`;
    }
}

export const Ok = <T, E>(value: T): Result<T, E> => new OkImpl(value);
export const Err = <T, E>(error: E): Result<T, E> => new ErrImpl(error);