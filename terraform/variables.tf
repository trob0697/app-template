variable "project_number" {
  description = "Google Cloud Project Number"
  type        = string
  default     = ""
}

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
  default     = ""
}

variable "region" {
  description = "Google Cloud Region"
  type        = string
  default     = "us-east1"
}

variable "domain" {
  description = "Application Registered Domain"
  type        = string
  default     = ""
}

variable "deletion_protection" {
  description = "Protect All Services From Being Deleted"
  type        = bool
  default     = false
}