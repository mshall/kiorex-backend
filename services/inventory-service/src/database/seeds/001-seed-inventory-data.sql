-- Seed Locations
INSERT INTO locations (name, code, description, address) VALUES
('Main Warehouse', 'MAIN-WH', 'Primary inventory warehouse', '123 Healthcare Blvd, Medical District'),
('Pharmacy Storage', 'PHARM-ST', 'Pharmacy inventory storage', '456 Medicine Ave, Pharmacy Wing'),
('Surgery Suite Storage', 'SURG-ST', 'Surgical supplies storage', '789 Operating Room St, Surgery Wing'),
('Emergency Department', 'ED-ST', 'Emergency department supplies', '321 Emergency Way, ED Wing'),
('Laboratory Storage', 'LAB-ST', 'Laboratory supplies storage', '654 Lab Lane, Laboratory Wing');

-- Seed Suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, city, state, country, postal_code, tax_id, payment_terms) VALUES
('MedSupply Corp', 'John Smith', 'john.smith@medsupply.com', '+1-555-0101', '100 Medical Supply Dr', 'Healthcare City', 'CA', 'USA', '90210', 'TAX123456789', 'Net 30'),
('PharmaDirect', 'Sarah Johnson', 'sarah.johnson@pharmadirect.com', '+1-555-0102', '200 Pharmaceutical Ave', 'Medicine Town', 'NY', 'USA', '10001', 'TAX987654321', 'Net 15'),
('Surgical Solutions', 'Mike Chen', 'mike.chen@surgicalsolutions.com', '+1-555-0103', '300 Surgery Blvd', 'Surgical City', 'TX', 'USA', '75001', 'TAX456789123', 'Net 45'),
('Lab Equipment Inc', 'Emily Davis', 'emily.davis@labeq.com', '+1-555-0104', '400 Lab Equipment St', 'Research City', 'FL', 'USA', '33101', 'TAX789123456', 'Net 30'),
('Emergency Supplies Ltd', 'David Wilson', 'david.wilson@emergsupplies.com', '+1-555-0105', '500 Emergency Way', 'Crisis City', 'IL', 'USA', '60601', 'TAX321654987', 'Net 20');

-- Seed Inventory Items
INSERT INTO inventory_items (sku, name, description, category, subcategory, unit_of_measure, unit_cost, selling_price, supplier_id, minimum_stock_level, maximum_stock_level, reorder_point) VALUES
('SYR-001', 'Disposable Syringes 10ml', 'Sterile disposable syringes 10ml', 'Medical Supplies', 'Syringes', 'Each', 0.50, 1.00, (SELECT id FROM suppliers WHERE name = 'MedSupply Corp'), 100, 1000, 200),
('GLO-001', 'Nitrile Gloves Medium', 'Powder-free nitrile examination gloves', 'Medical Supplies', 'Gloves', 'Box of 100', 5.00, 10.00, (SELECT id FROM suppliers WHERE name = 'MedSupply Corp'), 50, 500, 100),
('MASK-001', 'Surgical Masks', '3-ply surgical face masks', 'Medical Supplies', 'Masks', 'Box of 50', 8.00, 15.00, (SELECT id FROM suppliers WHERE name = 'MedSupply Corp'), 25, 250, 50),
('BAND-001', 'Elastic Bandages', 'Self-adhesive elastic bandages 4 inch', 'Medical Supplies', 'Bandages', 'Roll', 2.50, 5.00, (SELECT id FROM suppliers WHERE name = 'MedSupply Corp'), 20, 200, 40),
('MED-001', 'Acetaminophen 500mg', 'Pain relief medication 500mg tablets', 'Medications', 'Pain Relief', 'Bottle of 100', 3.00, 6.00, (SELECT id FROM suppliers WHERE name = 'PharmaDirect'), 30, 300, 60),
('MED-002', 'Ibuprofen 200mg', 'Anti-inflammatory medication 200mg tablets', 'Medications', 'Anti-inflammatory', 'Bottle of 100', 4.00, 8.00, (SELECT id FROM suppliers WHERE name = 'PharmaDirect'), 25, 250, 50),
('SURG-001', 'Surgical Scissors', 'Stainless steel surgical scissors', 'Surgical Instruments', 'Scissors', 'Each', 25.00, 50.00, (SELECT id FROM suppliers WHERE name = 'Surgical Solutions'), 5, 50, 10),
('SURG-002', 'Suture Material', 'Absorbable surgical suture 3-0', 'Surgical Instruments', 'Sutures', 'Pack of 12', 15.00, 30.00, (SELECT id FROM suppliers WHERE name = 'Surgical Solutions'), 10, 100, 20),
('LAB-001', 'Test Tubes', 'Glass test tubes 10ml', 'Laboratory Supplies', 'Glassware', 'Box of 100', 20.00, 40.00, (SELECT id FROM suppliers WHERE name = 'Lab Equipment Inc'), 20, 200, 40),
('LAB-002', 'Microscope Slides', 'Glass microscope slides 25x75mm', 'Laboratory Supplies', 'Glassware', 'Box of 100', 8.00, 16.00, (SELECT id FROM suppliers WHERE name = 'Lab Equipment Inc'), 50, 500, 100),
('EMERG-001', 'First Aid Kit', 'Complete first aid kit', 'Emergency Supplies', 'First Aid', 'Kit', 25.00, 50.00, (SELECT id FROM suppliers WHERE name = 'Emergency Supplies Ltd'), 10, 100, 20),
('EMERG-002', 'Defibrillator Pads', 'Disposable defibrillator pads', 'Emergency Supplies', 'Defibrillation', 'Pair', 15.00, 30.00, (SELECT id FROM suppliers WHERE name = 'Emergency Supplies Ltd'), 5, 50, 10);

-- Seed Stock Levels
INSERT INTO stock_levels (item_id, location_id, quantity_on_hand, quantity_reserved) VALUES
((SELECT id FROM inventory_items WHERE sku = 'SYR-001'), (SELECT id FROM locations WHERE code = 'MAIN-WH'), 500, 50),
((SELECT id FROM inventory_items WHERE sku = 'GLO-001'), (SELECT id FROM locations WHERE code = 'MAIN-WH'), 200, 20),
((SELECT id FROM inventory_items WHERE sku = 'MASK-001'), (SELECT id FROM locations WHERE code = 'MAIN-WH'), 150, 15),
((SELECT id FROM inventory_items WHERE sku = 'BAND-001'), (SELECT id FROM locations WHERE code = 'MAIN-WH'), 100, 10),
((SELECT id FROM inventory_items WHERE sku = 'MED-001'), (SELECT id FROM locations WHERE code = 'PHARM-ST'), 150, 15),
((SELECT id FROM inventory_items WHERE sku = 'MED-002'), (SELECT id FROM locations WHERE code = 'PHARM-ST'), 120, 12),
((SELECT id FROM inventory_items WHERE sku = 'SURG-001'), (SELECT id FROM locations WHERE code = 'SURG-ST'), 25, 5),
((SELECT id FROM inventory_items WHERE sku = 'SURG-002'), (SELECT id FROM locations WHERE code = 'SURG-ST'), 50, 5),
((SELECT id FROM inventory_items WHERE sku = 'LAB-001'), (SELECT id FROM locations WHERE code = 'LAB-ST'), 100, 10),
((SELECT id FROM inventory_items WHERE sku = 'LAB-002'), (SELECT id FROM locations WHERE code = 'LAB-ST'), 250, 25),
((SELECT id FROM inventory_items WHERE sku = 'EMERG-001'), (SELECT id FROM locations WHERE code = 'ED-ST'), 30, 3),
((SELECT id FROM inventory_items WHERE sku = 'EMERG-002'), (SELECT id FROM locations WHERE code = 'ED-ST'), 20, 2);

-- Seed Purchase Orders
INSERT INTO purchase_orders (po_number, supplier_id, status, total_amount, ordered_by, ordered_at, expected_delivery_date, notes) VALUES
('PO-2024-001', (SELECT id FROM suppliers WHERE name = 'MedSupply Corp'), 'approved', 2500.00, '550e8400-e29b-41d4-a716-446655440001', '2024-01-15 10:00:00', '2024-01-22', 'Monthly medical supplies order'),
('PO-2024-002', (SELECT id FROM suppliers WHERE name = 'PharmaDirect'), 'received', 1200.00, '550e8400-e29b-41d4-a716-446655440001', '2024-01-10 14:30:00', '2024-01-17', 'Pharmacy medication restock'),
('PO-2024-003', (SELECT id FROM suppliers WHERE name = 'Surgical Solutions'), 'draft', 1800.00, '550e8400-e29b-41d4-a716-446655440001', '2024-01-20 09:15:00', '2024-01-27', 'Surgical instruments order'),
('PO-2024-004', (SELECT id FROM suppliers WHERE name = 'Lab Equipment Inc'), 'approved', 900.00, '550e8400-e29b-41d4-a716-446655440001', '2024-01-18 11:45:00', '2024-01-25', 'Laboratory supplies order'),
('PO-2024-005', (SELECT id FROM suppliers WHERE name = 'Emergency Supplies Ltd'), 'received', 600.00, '550e8400-e29b-41d4-a716-446655440001', '2024-01-12 16:20:00', '2024-01-19', 'Emergency department supplies');

-- Seed Purchase Order Items
INSERT INTO purchase_order_items (purchase_order_id, item_id, quantity_ordered, quantity_received, unit_cost) VALUES
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-001'), (SELECT id FROM inventory_items WHERE sku = 'SYR-001'), 1000, 0, 0.50),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-001'), (SELECT id FROM inventory_items WHERE sku = 'GLO-001'), 200, 0, 5.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-001'), (SELECT id FROM inventory_items WHERE sku = 'MASK-001'), 100, 0, 8.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-002'), (SELECT id FROM inventory_items WHERE sku = 'MED-001'), 200, 200, 3.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-002'), (SELECT id FROM inventory_items WHERE sku = 'MED-002'), 150, 150, 4.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-003'), (SELECT id FROM inventory_items WHERE sku = 'SURG-001'), 20, 0, 25.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-003'), (SELECT id FROM inventory_items WHERE sku = 'SURG-002'), 40, 0, 15.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-004'), (SELECT id FROM inventory_items WHERE sku = 'LAB-001'), 50, 0, 20.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-004'), (SELECT id FROM inventory_items WHERE sku = 'LAB-002'), 100, 0, 8.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-005'), (SELECT id FROM inventory_items WHERE sku = 'EMERG-001'), 20, 20, 25.00),
((SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-005'), (SELECT id FROM inventory_items WHERE sku = 'EMERG-002'), 20, 20, 15.00);

-- Seed Stock Movements
INSERT INTO stock_movements (item_id, movement_type, quantity, unit_cost, reference_type, reference_id, location_id, notes, created_by) VALUES
((SELECT id FROM inventory_items WHERE sku = 'MED-001'), 'receipt', 200, 3.00, 'purchase_order', (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-002'), (SELECT id FROM locations WHERE code = 'PHARM-ST'), 'Received from PO-2024-002', '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM inventory_items WHERE sku = 'MED-002'), 'receipt', 150, 4.00, 'purchase_order', (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-002'), (SELECT id FROM locations WHERE code = 'PHARM-ST'), 'Received from PO-2024-002', '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM inventory_items WHERE sku = 'EMERG-001'), 'receipt', 20, 25.00, 'purchase_order', (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-005'), (SELECT id FROM locations WHERE code = 'ED-ST'), 'Received from PO-2024-005', '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM inventory_items WHERE sku = 'EMERG-002'), 'receipt', 20, 15.00, 'purchase_order', (SELECT id FROM purchase_orders WHERE po_number = 'PO-2024-005'), (SELECT id FROM locations WHERE code = 'ED-ST'), 'Received from PO-2024-005', '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM inventory_items WHERE sku = 'SYR-001'), 'usage', -50, 0.50, 'clinical_usage', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM locations WHERE code = 'MAIN-WH'), 'Used in clinical procedures', '550e8400-e29b-41d4-a716-446655440001'),
((SELECT id FROM inventory_items WHERE sku = 'GLO-001'), 'usage', -20, 5.00, 'clinical_usage', '550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM locations WHERE code = 'MAIN-WH'), 'Used in clinical procedures', '550e8400-e29b-41d4-a716-446655440001');
