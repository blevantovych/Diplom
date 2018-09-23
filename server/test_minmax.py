import unittest
import minmax
from sympy import symbols, simplify, Symbol, lambdify
import numpy as np

class TestMinmaxModule(unittest.TestCase):

    def test_make_eq(self):
        self.assertEqual(minmax.make_eq(symbols('a0 a1 a2'), 1, 'x^2 + x'), simplify('2 - a0 - a1 - a2'))
        self.assertEqual(minmax.make_eq(symbols('a0 a1'), 1.2, 'x^2 + x + 2'), simplify('4.64 - a0 - 1.2*a1'))
        self.assertEqual(minmax.make_eq(symbols('a b, c'), 0.5, 'x'), simplify('0.5 - 1.0*a - 0.5*b - 0.25*c'))

    def test_max_error(self):
        func = np.vectorize(lambdify(Symbol('x'), simplify('x^2')))
        self.assertEqual(minmax.max_error(func, 1, 4), 16)

        func = np.vectorize(lambdify(Symbol('x'), simplify('sin(x) - 1.2 * x^2 + 1.53 * x')))
        self.assertAlmostEqual(minmax.max_error(func, -5, 5), -36.6910757253)
        
if __name__ == '__main__':
    unittest.main()