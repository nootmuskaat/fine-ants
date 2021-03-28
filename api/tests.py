from django.test import Client, TestCase

from api.models import Category, SubCategory

JSON = "application/json"


class CategoriesTestCase(TestCase):
    def test_create_and_fetch_categories(self):
        c = Client()
        endpoint = "/api/categories"
        categories = {
            "groceries": ["general", "alcohol"],
            "going-out": ["restaurants", "drinks"],
        }
        for parent, children in categories.items():
            for child in children:
                data = {"parent": parent, "name": child}
                c.post(endpoint, data=data, content_type=JSON)
        response = c.get(endpoint)
        self.assertEqual(response.json(), categories)
