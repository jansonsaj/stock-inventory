CREATE TABLE IF NOT EXISTS items(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    wholesale_price INTEGER,
    retail_price INTEGER,
    max_stock INTEGER,
    min_stock INTEGER,
    stock INTEGER,
    barcode TEXT,
    photo TEXT
);
