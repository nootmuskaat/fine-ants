from django.contrib.auth.models import Group, User
from django.db import models


class Currency(models.Model):
    """Such as USD, EUR, GBP, etc"""

    code = models.CharField(max_length=3)
    precision = models.PositiveSmallIntegerField(default=2)


class Account(models.Model):
    """Generally a bank account"""

    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name="accounts")
    name = models.CharField(max_length=255)
    identifier = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned")
    group = models.OneToOneField(Group, on_delete=models.CASCADE, related_name="account")


class Category(models.Model):
    """A transaction category"""

    name = models.CharField(max_length=255)


class SubCategory(models.Model):
    """A transaction sub-category"""

    parent = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="children")
    name = models.CharField(max_length=255)


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
