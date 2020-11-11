CREATE TABLE IF NOT EXISTS items(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    barcode TEXT NOT NULL UNIQUE,
    name TEXT,
    description TEXT,
    wholesale_price INTEGER,
    retail_price INTEGER,
    max_stock INTEGER,
    min_stock INTEGER,
    stock INTEGER,
    photo TEXT
);
