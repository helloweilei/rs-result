import { describe, it, expect } from 'vitest';
import { Ok, Err, Result } from '../index';

describe('Result', () => {
    describe('Ok', () => {
        it('should create Ok value', () => {
            const result = Ok(42);
            expect(result.isOk()).toBe(true);
            expect(result.isErr()).toBe(false);
        });

        it('should unwrap Ok value', () => {
            const result = Ok(42);
            expect(result.unwrap()).toBe(42);
        });

        it('should map Ok value', () => {
            const result = Ok(42).map(x => x * 2);
            expect(result.unwrap()).toBe(84);
        });

        it('should mapOr Ok value', () => {
            const result = Ok(42).mapOr(0, x => x * 2);
            expect(result).toBe(84);
        });

        it('should mapOrElse Ok value', () => {
            const result = Ok(42).mapOrElse(() => 0, x => x * 2);
            expect(result).toBe(84);
        });

        it('should andThen Ok value', () => {
            const result = Ok(42).andThen(x => Ok(x * 2));
            expect(result.unwrap()).toBe(84);
        });

        it('should unwrapOr with Ok value', () => {
            const result = Ok(42).unwrapOr(0);
            expect(result).toBe(42);
        });

        it('should unwrapOrElse with Ok value', () => {
            const result = Ok(42).unwrapOrElse(() => 0);
            expect(result).toBe(42);
        });

        it('should expect with Ok value', () => {
            const result = Ok(42).expect('should not panic');
            expect(result).toBe(42);
        });

        it('should throw on unwrapErr for Ok value', () => {
            const result = Ok(42);
            expect(() => result.unwrapErr()).toThrow('called `unwrapErr` on an `Ok` value');
        });

        it('should throw on expectErr for Ok value', () => {
            const result = Ok(42);
            expect(() => result.expectErr('custom error')).toThrow('called `expectErr` on an `Ok` value');
        });

        it('should inspect Ok value', () => {
            let captured: number | null = null;
            const result = Ok(42).inspect(x => { captured = x; });
            expect(captured).toBe(42);
            expect(result.unwrap()).toBe(42);
        });

        it('should or with Ok value returns Ok', () => {
            const result = Ok(42).or(Err('error'));
            expect(result.unwrap()).toBe(42);
        });

        it('should orElse with Ok value returns Ok', () => {
            const result = Ok(42).orElse(() => Err('error'));
            expect(result.unwrap()).toBe(42);
        });
    });

    describe('Err', () => {
        it('should create Err value', () => {
            const result = Err('error');
            expect(result.isOk()).toBe(false);
            expect(result.isErr()).toBe(true);
        });

        it('should unwrapErr Err value', () => {
            const result = Err('error');
            expect(result.unwrapErr()).toBe('error');
        });

        it('should unwrapOr with Err value', () => {
            const result = Err('error').unwrapOr(42);
            expect(result).toBe(42);
        });

        it('should unwrapOrElse with Err value', () => {
            const result = Err('error').unwrapOrElse(() => 42);
            expect(result).toBe(42);
        });

        it('should mapOr with Err value returns default', () => {
            const result = Err<number, string>('error').mapOr(42, (x) => x * 2);
            expect(result).toBe(42);
        });

        it('should mapOrElse with Err value calls defaultOp', () => {
            const result = Err<number, string>('error').mapOrElse(err => err.length, x => x * 2);
            expect(result).toBe(5);
        });

        it('should mapErr with Err value', () => {
            const result = Err('error').mapErr(e => e.toUpperCase());
            expect(result.unwrapErr()).toBe('ERROR');
        });

        it('should orElse with Err value returns fallback', () => {
            const result = Err('error').orElse(() => Err('fallback'));
            expect(result.unwrapErr()).toBe('fallback');
        });

        it('should throw on unwrap for Err value', () => {
            const result = Err('error');
            expect(() => result.unwrap()).toThrow('called `unwrap` on an `Err` value');
        });

        it('should throw on expect for Err value', () => {
            const result = Err('error');
            expect(() => result.expect('custom error')).toThrow('custom error');
        });

        it('should inspectErr Err value', () => {
            let captured: string | null = null;
            const result = Err('error').inspectErr(e => { captured = e; });
            expect(captured).toBe('error');
            expect(result.unwrapErr()).toBe('error');
        });

        it('should and with Err value returns Err', () => {
            const result = Err('error').and(Ok(42));
            expect(result.unwrapErr()).toBe('error');
        });

        it('should andThen with Err value returns Err', () => {
            const result = Err<number, string>('error').andThen(x => Ok(x * 2));
            expect(result.unwrapErr()).toBe('error');
        });
    });

    describe('and', () => {
        it('should return res when self is Ok', () => {
            const result = Ok(2).and(Ok('foo'));
            expect(result.unwrap()).toBe('foo');
        });

        it('should return self when self is Err', () => {
            const result = Err('early error').and(Ok('foo'));
            expect(result.unwrapErr()).toBe('early error');
        });
    });

    describe('or', () => {
        it('should return self when self is Ok', () => {
            const result = Ok(2).or(Err('late error'));
            expect(result.unwrap()).toBe(2);
        });

        it('should return res when self is Err', () => {
            const result = Err('early error').or(Err('late error'));
            expect(result.unwrapErr()).toBe('late error');
        });
    });

    describe('ok and err methods', () => {
        it('should convert Ok to Some', () => {
            const result = Ok(42);
            const ok = result.ok();
            expect(ok.isSome()).toBe(true);
            expect(ok.unwrap()).toBe(42);
        });

        it('should convert Ok Err to None', () => {
            const result = Ok(42);
            const err = result.err();
            expect(err.isNone()).toBe(true);
        });

        it('should convert Err Ok to None', () => {
            const result = Err('error');
            const ok = result.ok();
            expect(ok.isNone()).toBe(true);
        });

        it('should convert Err to Some', () => {
            const result = Err('error');
            const err = result.err();
            expect(err.isSome()).toBe(true);
            expect(err.unwrap()).toBe('error');
        });
    });
});
