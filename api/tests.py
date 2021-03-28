from django.test import Client, TestCase

from api.models import Category, SubCategory

JSON = "application/json"

class CategoriesTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_create_and_fetch_categories(self):
        endpoint = "/api/categories"
        categories = {
            "Groceries": {"General", "Alcohol"},
            "Going out": {"Restaurants", "Drinks"},
        }
        for parent, children in categories.items():
            for child in children:
                data = {"parent": parent, "name": child}
                self.client.post(endpoint, data=data, content_type=JSON)
        response = self.client.get(endpoint)
        comparable_response = {k: set(v) for k, v in response.json().items()}
        self.assertEqual(comparable_response, categories)
