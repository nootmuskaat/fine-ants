from django.test import Client, TestCase

from api.models import Category, SubCategory

JSON = "application/json"

class CategoriesTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_create_and_fetch_categories(self):
        endpoint = "/api/categories"
        categories = [
            {"name": "Going out", "children": ["Drinks", "Restaurants"]},
            {"name": "Groceries", "children": ["Alcohol", "General"]}
        ]
        for category in categories:
            for child in category["children"]:
                data = {"parent": category["name"], "name": child}
                self.client.post(endpoint, data=data, content_type=JSON)
        response = self.client.get(endpoint)
        self.assertEqual(response.json(), categories)
