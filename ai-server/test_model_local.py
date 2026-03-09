
import model
import unittest

class TestDisasterModel(unittest.TestCase):
    def test_critical_priority(self):
        description = "This is a medical emergency, we need urgent help."
        priority = model.predict_priority(description)
        print(f"Input: '{description}' -> Priority: {priority}")
        self.assertEqual(priority, 'Critical')

    def test_high_priority(self):
        description = "We are starving and need food."
        priority = model.predict_priority(description)
        print(f"Input: '{description}' -> Priority: {priority}")
        self.assertEqual(priority, 'High')

    def test_medium_priority(self):
        description = "We need blankets and clothes."
        priority = model.predict_priority(description)
        print(f"Input: '{description}' -> Priority: {priority}")
        self.assertEqual(priority, 'Medium')

    def test_low_priority(self):
        description = "Just checking in, all is relatively safe."
        priority = model.predict_priority(description)
        print(f"Input: '{description}' -> Priority: {priority}")
        self.assertEqual(priority, 'Low')

if __name__ == '__main__':
    print("Running Local Model Tests...")
    unittest.main(argv=['first-arg-is-ignored'], exit=False)
