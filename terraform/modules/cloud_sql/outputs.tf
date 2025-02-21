output "connection_url" {
  value = "postgresql://${google_sql_user.default.name}:${google_sql_user.default.password}@/postgres?host=/cloudsql/${google_sql_database_instance.postgres.connection_name}"
}

output "connection_name" {
  value = google_sql_database_instance.postgres.connection_name
}
