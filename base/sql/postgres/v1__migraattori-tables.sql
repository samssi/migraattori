CREATE TABLE migraattori.migration_history
(
    migration_id SERIAL,
    migration_user TEXT,
    migration_file TEXT,
    migration_installation_time timestamp without time zone default (now() at time zone 'utc'),
    migration_status TEXT CHECK (migration_status in ('done', 'failure')),
    version TEXT
);