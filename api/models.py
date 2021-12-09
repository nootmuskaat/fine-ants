from django.contrib.auth.models import Group, User
from django.db import models


class Currency(models.Model):
    """Such as USD, EUR, GBP, etc"""

    code = models.CharField(max_length=3)
    precision = models.PositiveSmallIntegerField(default=2)


class FinancialInstitution(models.Model):
    """A bank or credit union or other entity associated with an account"""

    name = models.CharField(max_length=255)
    import_map = models.CharField(max_length=255)


class Account(models.Model):
    """Generally a bank account"""

    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name="accounts")
    name = models.CharField(max_length=255)
    identifier = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="accounts")
    financial_institution = models.ForeignKey(FinancialInstitution, on_delete=models.CASCADE, related_name="accounts")


class Category(models.Model):
    """A transaction category"""

    name = models.CharField(max_length=255, unique=True)


class SubCategory(models.Model):
    """A transaction sub-category"""

    parent = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="children")
    name = models.CharField(max_length=255)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["parent", "name"], name="unique_category"),
        ]


class Transaction(models.Model):
    """A financial transaction"""

    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="transactions")
    category = models.ForeignKey(
        SubCategory, on_delete=models.CASCADE, related_name="transactions"
    )
    date = models.DateField()
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    hash = models.CharField(max_length=255)


class SharedAccounts(models.Model):
    """Which accounts have been shared with which users"""

    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)