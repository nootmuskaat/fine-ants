from datetime import date
from typing import Optional

from pydantic import condecimal
from sqlmodel import Field, SQLModel, create_engine

from .config import sqlite_db_url


class User(SQLModel, table=True):
    """A Fine Ants User"""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    password_hash: str
    salt: str


class Currency(SQLModel, table=True):
    """Such as USD, EUR, GBP, etc"""

    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(min_length=3, max_length=3)
    precision: int = Field(ge=0, le=3)


class FinancialInstitution(SQLModel, table=True):
    """A bank or credit union or other entity associated with an account"""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    import_map: str


class Account(SQLModel, table=True):
    """Generally a bank account"""

    id: Optional[int] = Field(default=None, primary_key=True)
    currency: Optional[int] = Field(default=None, foreign_key="currency.id")
    name: str
    identifier: str
    financial_institution: Optional[int] = Field(
        default=None, foreign_key="financial_institution.id"
    )


class ParentCategory(SQLModel, table=True):
    """A transaction category"""

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str


class Category(SQLModel, table=True):
    """A transaction sub-category"""

    id: Optional[int] = Field(default=None, primary_key=True)
    parent: Optional[int] = Field(default=None, foreign_key="parent_category.id")
    name: str


_Decimal = condecimal(max_digits=8, decimal_places=3)


class Transaction(SQLModel, table=True):
    """A financial transaction"""

    id: Optional[int] = Field(default=None, primary_key=True)
    account: Optional[int] = Field(default=None, foreign_key="account.id")
    category: Optional[int] = Field(default=None, foreign_key="category.id")
    date: date = Field(default_factory=date.today)
    description: str
    amount: _Decimal
    balance: _Decimal
    hash: str


class SharedAccounts(SQLModel, table=True):
    """Which accounts have been shared with which users"""

    account: Optional[int] = Field(foreign_key="account.id")
    user: Optional[int] = Field(foreign_key="user.id")


engine = create_engine(sqlite_db_url(), echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
