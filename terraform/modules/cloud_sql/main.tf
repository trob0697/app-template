data "google_secret_manager_secret_version" "database_password" {
  secret  = "DATABASE_PASSWORD"
}

resource "google_sql_database_instance" "postgres" {
  name                = "postgres-instance"
  region              = var.region
  database_version    = "POSTGRES_14"
  deletion_protection = var.deletion_protection
  settings {
    tier = "db-f1-micro"
    backup_configuration {
      enabled = true
    }
  }
}

resource "google_sql_user" "default" {
  instance        = google_sql_database_instance.postgres.name
  name            = "postgres"
  password        = data.google_secret_manager_secret_version.database_password.secret_data
  deletion_policy = "ABANDON"
}
