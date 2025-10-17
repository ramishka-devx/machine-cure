-- CI-safe baseline seed: roles and any required bootstrap data

INSERT IGNORE INTO roles (name) VALUES ('admin'), ('user');
