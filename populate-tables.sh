#!/bin/bash

DB="website.db"

function table_exists {
    EXISTS=$(sqlite3 $DB "SELECT name FROM sqlite_master WHERE type='table' AND name='$1'")
    if [ -z "$EXISTS" ]
    then
        return 1
    else
        return 0
    fi
}

# Load users table and initial data if it doesn't exist
table_exists "users"
if [ "$?" -eq 1 ]
then
    sqlite3 $DB < users.sql
    sqlite3 $DB < users-data.sql
fi

# Load items table and initial data if it doesn't exist
table_exists "items"
if [ "$?" -eq 1 ]
then
    sqlite3 $DB < items.sql
    sqlite3 $DB < items-data.sql
fi
