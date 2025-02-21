resource "google_cloud_run_v2_service" "default" {
  name                = var.service_name
  location            = var.region
  deletion_protection = var.deletion_protection
  template {
    service_account                  = var.service_account
    timeout                          = var.timeout
    max_instance_request_concurrency = var.max_instance_request_concurrency
    scaling {
      min_instance_count = var.min_instance_count
      max_instance_count = var.max_instance_count
    }
    dynamic "volumes" {
      for_each = var.cloud_sql_connection_name != null ? [1] : []
      content {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [var.cloud_sql_connection_name]
        }
      }
    }
    containers {
      image = var.image_url
      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
        cpu_idle          = true
        startup_cpu_boost = true
      }
      dynamic "env" {
        for_each = var.secrets_env_vars
        content {
          name = env.value
          value_source {
            secret_key_ref {
              secret  = env.value
              version = "latest"
            }
          }
        }
      }
      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }
  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

resource "google_cloud_run_v2_service_iam_binding" "auth" {
  project  = google_cloud_run_v2_service.default.project
  location = google_cloud_run_v2_service.default.location
  name     = google_cloud_run_v2_service.default.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]
}

resource "google_cloud_run_domain_mapping" "default" {
  for_each = var.custom_domains
  location = var.region
  name     = each.key
  metadata {
    namespace = var.project_id
  }
  spec {
    route_name = google_cloud_run_v2_service.default.name
  }
}
