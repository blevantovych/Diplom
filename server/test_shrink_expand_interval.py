import unittest
import spline_minmax as sm

class TestIntervalChange(unittest.TestCase):

    def test_shrink(self):
        self.assertEqual(sm.shrinkInterval([0, 1.5], [[0, 2], [0, 1], [0, 1.5]]), [0, 1.25])
        self.assertEqual(sm.shrinkInterval([0, 20], []), [0, 10])
        self.assertEqual(sm.shrinkInterval([0, 5], [[0, 10], [0, 5]]), [0, 2.5])
        self.assertEqual(sm.shrinkInterval([0, 7.5], [[0, 10], [0, 5], [0, 7.5]]), [0, 6.25])
        self.assertEqual(sm.shrinkInterval([2.5, 10], []), [2.5, 6.25])

    def test_expand(self):
        self.assertEqual(sm.expandInterval([0, 2], [[0, 4], [0, 2]]), [0, 3])
        self.assertEqual(sm.expandInterval([0, 2], [[0, 4], [0, 2]]), [0, 3])
        self.assertEqual(sm.expandInterval([0, 0.5], [[0, 4], [0, 2], [0, 1], [0, 0.5]]), [0, 0.75])
        
if __name__ == '__main__':
    unittest.main()