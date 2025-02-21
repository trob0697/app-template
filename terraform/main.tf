provider "google" {
  project = var.project_id
  region  = var.region
}

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.14.1"
    }
  }
}

resource "google_project_service" "secret_manager" {
  service = "secretmanager.googleapis.com"
}

resource "google_project_service" "cloud_run" {
  service = "run.googleapis.com"
}

resource "google_project_service" "sql_admin" {
  service = "sqladmin.googleapis.com"
}

module "service_account" {
  source     = "./modules/service_account"
  project_id = var.project_id
  account_id = "intake-ai-prod"
}

module "postgres_database" {
  source              = "./modules/cloud_sql"
  region              = var.region
  deletion_protection = var.deletion_protection
  depends_on          = [google_project_service.secret_manager]
}

module "backend" {
  source                           = "./modules/cloud_run_v2"
  project_id                       = var.project_id
  service_name                     = "backend"
  service_account                  = module.service_account.email
  region                           = var.region
  deletion_protection              = var.deletion_protection
  custom_domains                   = ["api.${var.domain}"]
  image_url                        = "gcr.io/${var.project_id}/backend:latest"
  timeout                          = "300s"
  max_instance_request_concurrency = 5
  min_instance_count               = 0
  max_instance_count               = 1
  cloud_sql_connection_name        = module.postgres_database.connection_name
  cpu                              = "1"
  memory                           = "512Mi"
  secrets_env_vars = [
    "ACCESS_TOKEN_SECRET",
    "ENCRYPTION_KEY",
    "GOOGLE_OAUTH_CLIENT_SECRET",
    "GOOGLE_OAUTH_CLIENT_ID",
    "REFRESH_TOKEN_SECRET",
  ]
  env_vars = {
    "CLIENT_URL" : "https://www.${var.domain}",
    "DATABASE_URL" : module.postgres_database.connection_url,
    "ENV" : "PRODUCTION"
  }
  depends_on = [
    google_project_service.cloud_run,
    google_project_service.sql_admin,
    module.postgres_database,
    module.service_account,
  ]
}

module "frontend" {
  source                           = "./modules/cloud_run_v2"
  project_id                       = var.project_id
  service_name                     = "frontend"
  service_account                  = module.service_account.email
  region                           = var.region
  deletion_protection              = var.deletion_protection
  custom_domains                   = [var.domain, "www.${var.domain}"]
  image_url                        = "gcr.io/${var.project_id}/frontend:latest"
  timeout                          = "300s"
  max_instance_request_concurrency = 5
  min_instance_count               = 0
  max_instance_count               = 1
  cpu                              = "1"
  memory                           = "512Mi"
  secrets_env_vars = [
    "GOOGLE_OAUTH_CLIENT_ID",
  ]
  env_vars = {
    "ENV" : "PRODUCTION",
    "NEXT_PUBLIC_API_URL" : "https://api.${var.domain}",
  }
  depends_on = [
    google_project_service.cloud_run,
    module.service_account,
  ]
}
