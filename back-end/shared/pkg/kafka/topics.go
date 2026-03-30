package kafka

const (
	VideoUploadedTopic        = "video-uploaded"
	TranscodingStartedTopic   = "transcoding-started"
	TranscodingCompletedTopic = "transcoding-completed"
	TranscodingFailedTopic    = "transcoding-failed"
	ContentAddedTopic         = "content-added"
)

var AllTopics = []string{
	VideoUploadedTopic,
	TranscodingStartedTopic,
	TranscodingCompletedTopic,
	TranscodingFailedTopic,
	ContentAddedTopic,
}
