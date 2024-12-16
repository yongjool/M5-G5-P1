<br />
<div align="center">

<h3 align="center">Mission 5</h3>
</div>

## About The Project

Task 5: Seed Auction Data into MongoDB

Develop a command-line interface (CLI) tool to seed data into your local MongoDB database or delete data from it.  Ensure that this tool is source-controlled and includes the seed data.  Team members should be able to seed data by cloning the repository.  Add sample data for a few auction items with the following 4 fields: title, description, start_price, reserve_price.

## Usage


### Commands

#### `list`
List all auction items in the database.

---

#### `add`
Add a new auction item.

Options:
- `-t, --title <title>`         Title of the auction item
- `-d, --description <description>` Description of the auction item
- `-s, --start_price <start_price>` Starting price of the auction item
- `-r, --reserve_price <reserve_price>` Reserve price of the auction item

---

#### `remove`
Remove an auction item.

Options:
- `-t, --title <title>`         Title of the auction item to remove

---

#### `update`
Update an existing auction item.

Options:
- `-t, --title <title>`           Title of the item to update
- `-n, --new_title <new_title>`   New title of the product
- `-d, --description <description>` Update the description of the item
- `-s, --start_price <start_price>` Update the starting price of the item
- `-r, --reserve_price <reserve_price>` Update the reserve price of the item

---
