import { expect } from 'chai';

// Sample function to test
export function add(a: number, b: number): number {
    return a + b;
}

// Define the test suite
export function runTests() {
    describe('Math Functions', () => {
        it('should add two numbers', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });

        it('should subtract two numbers', () => {
            const result = add(5, -2);
            expect(result).to.equal(3);
        });

        it('should add two numbers', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });

        it('should add two numbers', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });

        it('should add two numbers', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });
    });

    describe('asdf', () => {
        it('should add two numbers', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });

        it('should subtract two numbers', () => {
            const result = add(5, -2);
            expect(result).to.equal(3);
        });

        it('should add two numbers', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });

        it('should add two numbers', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });

        it('should add two numbers', () => {
            const result = add(2, 3);
            expect(result).to.equal(5);
        });
    });
}
