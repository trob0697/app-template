variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "service_name" {
  description = "Google Cloud Project Service Name"
  type        = string
}

variable "service_account" {
  description = "Service Account Email"
  type        = string
}

variable "region" {
  description = "Project Region"
  type        = string
}

variable "deletion_protection" {
  description = "Enable Cloud Run Deletion Protection"
  type        = bool
}

variable "custom_domains" {
  description = "Custom Domain"
  type        = set(string)
  default     = []
}

variable "image_url" {
  description = "Docker Image URL"
  type        = string
}

variable "timeout" {
  description = "Max allowed time for an instance to response to a request"
  type        = string
}

variable "max_instance_request_concurrency" {
  description = "Maximum Number of Requests An Instance Can Receive"
  type        = number
}

variable "min_instance_count" {
  description = "Minimum Instance Count"
  type        = number
}

variable "max_instance_count" {
  description = "Maximum Instance Count"
  type        = number
}

variable "cloud_sql_connection_name" {
  description = "Cloud SQL Database Connection Name"
  type        = string
  default     = null
}

variable "cpu" {
  description = "CPU Limit"
  type        = string
}

variable "memory" {
  description = "Memory Limit"
  type        = string
}

variable "secrets_env_vars" {
  description = "Environment Variables Stored In Google Cloud Secret Manager"
  type        = list(string)
  default     = []
}

variable "env_vars" {
  description = "Additional Environment Variables"
  type        = map(string)
  default     = {}
}
