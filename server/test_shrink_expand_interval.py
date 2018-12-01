import unittest
import spline_minmax as sm
import discrete_spline_minmax as dsm


class TestIntervalChange(unittest.TestCase):

    def test_shrink(self):
        self.assertEqual(sm.shrinkInterval([0, 20], []), [0, 10])
        self.assertEqual(sm.shrinkInterval([2.5, 10], []), [2.5, 6.25])
        self.assertEqual(sm.shrinkInterval([0, 5], [[0, 10], [0, 5]]), [0, 2.5])
        self.assertEqual(sm.shrinkInterval([0, 1.5], [[0, 2], [0, 1], [0, 1.5]]), [0, 1.25])
        self.assertEqual(sm.shrinkInterval([0, 7.5], [[0, 10], [0, 5], [0, 7.5]]), [0, 6.25])

    def test_expand(self):
        self.assertEqual(sm.expandInterval([0, 2], [[0, 4], [0, 2]]), [0, 3])
        self.assertEqual(sm.expandInterval([0, 2], [[0, 4], [0, 2]]), [0, 3])
        self.assertEqual(sm.expandInterval([0, 0.5], [[0, 4], [0, 2], [0, 1], [0, 0.5]]), [0, 0.75])

    # Discrete case

    def test_discrete_shrink(self):
        self.assertEqual(dsm.shrinkInterval(
            interval=[0, 12],
            history=[]
        ), [0, 6])

        self.assertEqual(dsm.shrinkInterval(
            interval=[1, 12],
            history=[]
        ), [1, 6])

        self.assertEqual(dsm.shrinkInterval(
            interval=[2, 3],
            history=[]
        ), [2, 3])

        self.assertEqual(dsm.shrinkInterval(
            interval=[2, 4],
            history=[]
        ), [2, 3])

        self.assertEqual(dsm.shrinkInterval(
            interval=[0, 6],
            history=[[0, 12], [0, 6], [0, 9]]
        ), [2, 3])

    def test_discrete_expand(self):
        self.assertEqual(dsm.expandInterval(
            interval=[0, 6],
            history=[[0, 12], [0, 6]]
        ), [0, 9])

        self.assertEqual(dsm.expandInterval(
            interval=[1, 6],
            history=[[1, 12], [1, 6]]
        ), [1, 9])

        self.assertEqual(dsm.expandInterval(
            interval=[0, 9],
            history=[[0, 12], [0, 6], [0, 9]]
        ), [0, 10])

        self.assertEqual(dsm.expandInterval(
            interval=[2, 3],
            history=[[2, 4], [2, 3]]
        ), [2, 3])


if __name__ == '__main__':
    unittest.main()
