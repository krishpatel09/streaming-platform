package model

type VideoUploadRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
}

type VideoUploadResponse struct {
	VideoID     string `json:"video_id"`
	UploadURL   string `json:"upload_url"`
}

type VideoUploadedEvent struct {
	VideoID     string `json:"video_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	StoragePath string `json:"storage_path"`
}
