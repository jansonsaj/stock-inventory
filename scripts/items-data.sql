-- Insert test data into items table
INSERT INTO items(barcode, name, description, wholesale_price, retail_price, max_stock, min_stock, stock, photo)
    VALUES("ARDUINO", "Arduino UNO R3",
    "Arduino Uno is the most used and documented board in the world.",
    500, 2000, 100, 10, 20, "https://m.media-amazon.com/images/I/519-y7vsUrL._AC_SX425_.jpg");
INSERT INTO items(barcode, name, description, wholesale_price, retail_price, max_stock, min_stock, stock, photo)
    VALUES("SERVO", "SG90 Micro Servo Motor",
    "Connector wire length: 150mm.
    Size: 23mm x 12.2mm x 29mm.
    Weight: 9 grams.
    Torsional moment: 1.5kg/cm.
    Working voltage: 4.2-6V.
    Operating speed: 0.3 seconds / 60 degrees.",
    500, 2000, 100, 10, 20, "https://opencircuit.shop/resources/content/2ed9317749689/crop/900-600/TowerPro-SG90-9G-micro-servo-motor.jpg");
INSERT INTO items(barcode, name, description, wholesale_price, retail_price, max_stock, min_stock, stock, photo)
    VALUES("WIRES", "Solderless flexible breadboard jumper wires (130 pcs)",
    "These wires are 1P to 1P and male to male, and they can be separated into the assembly that contains the wires of different quantities. These Dupont cable wires can connect to each other through a pin connector, they don't need welding, can be used for fast circut testing.",
    500, 2000, 100, 10, 20, "https://images-na.ssl-images-amazon.com/images/I/715moFOTkFL._AC_SL1500_.jpg");
