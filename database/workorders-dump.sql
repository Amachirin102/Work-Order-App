-- =============================================================================
-- WorkOrderApp — Full SQLite Dump (schema + sample data)
-- =============================================================================
-- This file is a complete dump of the workorders.db SQLite database used by
-- the Facility Maintenance Work Order Management application. It contains
-- both the table definition and a representative set of sample records.
--
-- To rebuild the database from this dump:
--     sqlite3 workorders.db < workorders-dump.sql
--
-- To inspect it interactively without rebuilding:
--     sqlite3 :memory: ".read workorders-dump.sql" ".schema" "SELECT * FROM WorkOrders;"
-- =============================================================================

PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- -----------------------------------------------------------------------------
-- Table: WorkOrders
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "WorkOrders" (
    "Id"              INTEGER NOT NULL CONSTRAINT "PK_WorkOrders" PRIMARY KEY AUTOINCREMENT,
    "WorkOrderNumber" TEXT    NOT NULL,
    "Title"           TEXT    NOT NULL,
    "Description"     TEXT    NULL,
    "Priority"        TEXT    NOT NULL,
    "Status"          TEXT    NOT NULL,
    "CustomerName"    TEXT    NOT NULL,
    "TechnicianName"  TEXT    NULL,
    "EstimatedCost"   TEXT    NULL,
    "CreatedAt"       TEXT    NOT NULL,
    "UpdatedAt"       TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS "IX_WorkOrders_Status"          ON "WorkOrders" ("Status");
CREATE INDEX IF NOT EXISTS "IX_WorkOrders_Priority"        ON "WorkOrders" ("Priority");
CREATE INDEX IF NOT EXISTS "IX_WorkOrders_WorkOrderNumber" ON "WorkOrders" ("WorkOrderNumber");
CREATE INDEX IF NOT EXISTS "IX_WorkOrders_CreatedAt"       ON "WorkOrders" ("CreatedAt");

-- -----------------------------------------------------------------------------
-- Sample Data
-- -----------------------------------------------------------------------------
INSERT INTO "WorkOrders" ("Id","WorkOrderNumber","Title","Description","Priority","Status","CustomerName","TechnicianName","EstimatedCost","CreatedAt","UpdatedAt") VALUES
 (1,  'WO-20260101-A1B2', 'Fix HVAC System',              'AC unit not cooling properly on the third floor.',         'High',   'In Progress', 'Acme Building',         'John Smith',     '500.00',  '2026-01-05T09:12:00Z', '2026-01-06T14:30:00Z'),
 (2,  'WO-20260102-C3D4', 'Replace Light Fixtures',       'Lobby lighting needs replacement after recent flicker.',   'Medium', 'New',         'Westfield Plaza',       NULL,             '200.00',  '2026-01-07T11:00:00Z', '2026-01-07T11:00:00Z'),
 (3,  'WO-20260103-E5F6', 'Plumbing Repair',              'Leak in basement bathroom near janitor closet.',           'High',   'New',         'Tech Park Center',      'Maria Garcia',   '350.00',  '2026-01-08T08:45:00Z', '2026-01-08T08:45:00Z'),
 (4,  'WO-20260108-G7H8', 'Replace Air Filters',          'Quarterly preventative maintenance on all units.',         'Low',    'Completed',   'Acme Building',         'John Smith',     '120.00',  '2026-01-10T07:30:00Z', '2026-01-12T16:00:00Z'),
 (5,  'WO-20260110-I9J0', 'Repair Elevator Door Sensor',  'Door fails to close on second attempt.',                   'High',   'In Progress', 'Harbor Office Tower',   'Devon Lee',      '750.00',  '2026-01-14T10:15:00Z', '2026-01-15T09:20:00Z'),
 (6,  'WO-20260112-K1L2', 'Paint Conference Room',        'Repaint the main client-facing conference room.',          'Low',    'Assigned',    'Westfield Plaza',       'Priya Patel',    '450.00',  '2026-01-16T13:00:00Z', '2026-01-17T08:00:00Z'),
 (7,  'WO-20260115-M3N4', 'Roof Inspection',              'Annual inspection before rainy season.',                   'Medium', 'Completed',   'Lakeside Warehouse',    'Maria Garcia',   '300.00',  '2026-01-18T09:00:00Z', '2026-01-20T17:00:00Z'),
 (8,  'WO-20260118-O5P6', 'Replace Broken Window',        'Ground-floor window cracked after a storm.',               'High',   'On Hold',     'Tech Park Center',      'John Smith',     '600.00',  '2026-01-22T15:40:00Z', '2026-01-23T10:00:00Z'),
 (9,  'WO-20260120-Q7R8', 'Pressure-Wash Parking Garage', 'Routine cleaning of all three parking levels.',            'Low',    'New',         'Harbor Office Tower',   NULL,             '850.00',  '2026-01-25T08:00:00Z', '2026-01-25T08:00:00Z'),
 (10, 'WO-20260122-S9T0', 'Replace Smoke Detectors',      'Five units past their service life on floors four and five.','Medium','Assigned',  'Acme Building',         'Devon Lee',      '275.00',  '2026-01-27T11:30:00Z', '2026-01-28T09:00:00Z'),
 (11, 'WO-20260201-U1V2', 'Repair Loading Dock Door',     'Hydraulic seal failing on dock door three.',               'High',   'In Progress', 'Lakeside Warehouse',    'Priya Patel',    '1200.00', '2026-02-02T10:00:00Z', '2026-02-03T12:00:00Z'),
 (12, 'WO-20260205-W3X4', 'Service Backup Generator',     'Annual service and load test.',                            'Medium', 'Completed',   'Harbor Office Tower',   'John Smith',     '650.00',  '2026-02-06T08:30:00Z', '2026-02-08T16:30:00Z'),
 (13, 'WO-20260210-Y5Z6', 'Reseal Restroom Tile Grout',   'Mold visible along the base of the floor tiles.',          'Low',    'New',         'Westfield Plaza',       NULL,             '180.00',  '2026-02-12T14:00:00Z', '2026-02-12T14:00:00Z'),
 (14, 'WO-20260215-A7B8', 'Replace HVAC Compressor',      'Compressor on rooftop unit two is failing intermittently.','High',   'Cancelled',   'Tech Park Center',      'Maria Garcia',   '2400.00', '2026-02-18T09:00:00Z', '2026-02-19T15:00:00Z'),
 (15, 'WO-20260220-C9D0', 'Install New Door Locks',       'Upgrade all suite entry doors to badge readers.',          'Medium', 'In Progress', 'Acme Building',         'Devon Lee',      '3200.00', '2026-02-22T07:45:00Z', '2026-02-24T11:20:00Z');

COMMIT;
PRAGMA foreign_keys = ON;
