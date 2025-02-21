resource "google_service_account" "default" {
  account_id = var.account_id
}

resource "google_project_iam_binding" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  members = [
    "serviceAccount:${google_service_account.default.email}"
  ]
}

resource "google_project_iam_binding" "cloud_sql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  members = [
    "serviceAccount:${google_service_account.default.email}"
  ]
}
