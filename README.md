# fine-ants

A basic web application for keeping an eye on one's finances :)

## User story

Upon spinning up a fresh version of fine-ants, our user clicks `upload your
first file`, which allows them to navigate and select a CSV file from their
bank that they have stored locally.

They then select from a list of configured importers (translators, call it
what you will) the importer for the bank provided.

Seeing that the file contains one or more accounts that don't yet exist in the
system, the user is prompted to add the new account(s), specifying the currency
if not determinable from the file.

The user is then presented with a preview of the import (paginated if
necessary), where all transactions are either categorized as credits or not
classified. The user will have the option to categorize individual transactions
by clicking the `categorize` button next to the transaction, or create a new
rule by clicking the `create rule` button next to it, where they will be
presented with a modal window with the transaction's description pre-filled-in,
with a drop down menu to create either a `matching`, `contains`, or `regular
expression` rule. The user will then click the `preview` button, where they will
see all transactions that match the rule and how they will now be categorized,
from where they will either click `OK` or `back` where they can revise the rule.
In both cases (`categorize` and `create rule`), the user has the option to
create a new category in a modal window, providing it a name and assigning it a
color (with a randomly generated one being provided to start), which is then
saved upon clicking `OK` and selected as the category in the original drop down.

Once the user has created as many rules and categorized as many transactions as
they see fit to, they can then click the `import` button, saving all the
transactions, rules, and categories to the database.

Upon upload, they are directed to the dashboard, where they see tables of their
transactions from the latest month for which we have data (including a message
saying none is available for the current month if such is the case). They see as
many tables as there are categories, with each category showing the sum total
of what was spent in the category that month. Each category's table is (in some
way still TBD) color coordinated.

As the user scrolls down, they are presented with tables for the subsequent
months.

From the dashboard, the user again has the option to re-categorize transactions
in the tables or create new rules based on them as before (or an entirely
unrelated one by clicking the `Create Rule` button at the top of the dashboard).
Upon re-categorizing one or more transactions, the tables will refresh via
ajax, to seamlessly provide user with an up-to-date view.

The user can then upload new CSV files, following the same process as before
by cling the `Upload` button at the top of the dashboard, where the preview of
all new incoming transactions will include all the previously created rules.

***End MVP***

### Update Transaction Description

Realizing that the imported description of one transaction was ambiguous, the
user double-clicks on the current description and is presented with a text field
allowing them to edit and save the new transaction.


### View, Edit, and Reorder Rules

Wanting to take a look at what rules they initially created, our user clicks on
the `Manage Rules` button located in a drop down menu aside the `Create Rule`
button on the dashboard. They are directed to a new view, where they see a list
of all the currently created rules. The rules can be dragged and dropped to
reorder their precedence.

### Stop Processing More rules

Realizing that our user would like some rules to take effect while still
potentially allowing for another subsequent rule to run, they open the `Manage
Rules` view, find the rule in the question, select `Edit` and deselect the
checkbox labeled *Do not process any more rules* and then clicks `Save`.

### Rename Transaction Rules

Seeing that transactions from their favorite restaurant appear unrecognizable
each time they're imported, our user would like to create a rule alongside the
one they'd initially created to categorize it as **Going Out**, to also
automatically update the description. They go to the `Manage Rules` view, find
the rule previously created for the restaurant, and select the checkbox labeled
`Update description`, which presents them with a text box.
If the rule is of type `matching` or `contains`, the new description will be
whatever the user types into box. In the event that the rules is of type
`regular expression`, any parts captured with `(...)` in the rule, can then be
re-inserted by use of `\1`, `\2`, etc.

### Splitting transactions

Loving the convenience and insights provided by fine-ants, our user would like
to include their cash transactions as well. They find they're most recent cash
withdrawal and double click on the amount. They are presented with a modal
window where they are asked if they would like to split the current transaction.
They click on the `Add transaction` button and presented with fields to provide
a description, categorization and amount. Upon entering an amount, the value is
verified to be both greater than zero and less than the full transaction. If it
is not, the text box will be framed in red, with a message explaining the issue.
Once verified, a green arrow will appear next to the transaction. The User can
then repeat this process as many times as needed, before clicking save to commit
all transactions. The corresponding tables are refreshed.


### Sub-categorization
### Pie graphs for a given month or other time-period
### Scatter plots (with or without trend line) for a selected time period
### Multi-currency support
