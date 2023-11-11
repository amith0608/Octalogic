

CREATE TABLE vehicle_type(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    wheel_count INT NOT NULL
);

CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id INT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES vehicle_type(id) ON DELETE CASCADE
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    user_first_name VARCHAR(255) NOT NULL, 
    user_last_name VARCHAR(255) NOT NULL, 
    booking_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

INSERT INTO vehicle_type(name,wheel_count)
VALUES 
("Hatchback",4),
("Suv",4),
("Sedan",4),
("Cruiser",2),
("Sports",2);

INSERT INTO vehicles (name, type_id) VALUES
    ('Ford Fiesta', (SELECT id FROM vehicle_type WHERE name = 'Hatchback')),
    ('Jeep Wrangler', (SELECT id FROM vehicle_type WHERE name = 'Suv')),
    ('Honda City', (SELECT id FROM vehicle_type WHERE name = 'Sedan')),
    ('Royal Enfield Classic', (SELECT id FROM vehicle_type WHERE name = 'Cruiser')),
    ('Hayabusha', (SELECT id FROM vehicle_type WHERE name = 'Sports'));