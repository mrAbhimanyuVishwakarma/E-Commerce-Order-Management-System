-- data.sql
-- Insert mock data for initial testing

INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', 'admin123', 'ADMIN'),
('Test Customer', 'customer@example.com', 'customer123', 'CUSTOMER');

INSERT INTO products (name, description, price, stock) VALUES
('Laptop', 'High-performance laptop', 1200.00, 10),
('Smartphone', 'Latest model smartphone', 800.00, 20),
('Headphones', 'Noise-cancelling headphones', 150.00, 50);
