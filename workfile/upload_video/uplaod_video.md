# 📽️ Video Upload & Processing: Deep Technical Lifecycle

This document provides a comprehensive, service-by-service breakdown of the high-performance video pipeline.

---

### 🏗️ Phase A: Discovery & Connection (Initial Handshake)

**Deep Explain:**
Before a single byte of video is uploaded, the system performs a two-part handshake. First, it creates a "Draft" record in the catalog to track the upcoming process. Simultaneously, the Admin Panel opens a persistent Server-Sent Events (SSE) connection. This connection is the secret to the "Proper Flow"—it allows the server to push updates to the UI, eliminating the need for inefficient 404-prone polling.

**Service-Wise Explain:**
| Service | Responsibility |
| :--- | :--- |
| **Admin Service (8012)** | Receives the metadata from the React UI and coordinates with the Catalog. |
| **Catalog Service (8003)** | Validates the metadata and stores a "Draft" entry in MongoDB (returns videoID). |
| **Notification Service (8008)** | Establishes the SSE stream (/api/notifications/events/:id) and keeps the browser on standby. |

---

### 📦 Phase B: Secure Asset Ingestion (Direct-to-S3)

**Deep Explain:**
To handle massive 4K/8K files without crashing our Go backend, we use the "Zero-Proxy" pattern. The frontend requests a Presigned URL. This is a short-lived, cryptographically signed key that grants the browser restricted permission to write to a specific path in MinIO. The binary data travels over a unique stream directly from the browser's memory to the object store.

**Service-Wise Explain:**
| Service | Responsibility |
| :--- | :--- |
| **Streaming Service (8005)** | Uses the S3 SDK to sign a temporary PUT URL for the specific bucket (videos or hls). |
| **MinIO (9000)** | Receives the binary data directly, handles chunking, and verifies the signature. |
| **Front-End (React)** | Performs the HTTP PUT request and monitors upload progress for the UI progress bar. |

---

### 🎥 Phase C: The Event-Driven Trigger (Kafka Pipe)

**Deep Explain:**
Once the browser confirms the file is safely in MinIO, it notifies the Admin Service. This notification is the "Fuse" that lights the background pipeline. The Admin Service emits a high-priority message to the video-uploaded Kafka topic. Because we use Kafka, even if the transcoder worker is busy or restarting, the message is persisted and will never be lost.

**Service-Wise Explain:**
| Service | Responsibility |
| :--- | :--- |
| **Admin Service (8012)** | Validates that the upload is complete and emits the Kafka event. |
| **Kafka (Broker)** | Acts as the reliable "Courier," delivering the event to all interested worker nodes. |

---

### ⚙️ Phase D: Transcoding & Real-Time Feedback

**Deep Explain:**
The Transcoding Worker consumes the event, pulls the raw video, and executes an FFmpeg command to generate HLS segments. Once finished, it commits a transcoding-completed event back to Kafka. The Notification Service—acting as a real-time bridge—sees this event and immediately pushes a success signal down the pre-established SSE link to your browser.

**Service-Wise Explain:**
| Service | Responsibility |
| :--- | :--- |
| **Transcoding Service** | A stateless worker that converts .mp4 into HLS (1080p, 720p, 480p). |
| **Catalog Service (8003)** | Consumes the completion event and marks the video as PUBLISHED. |
| **Notification Service (8008)** | Consumes the event and performs the final SSE Push to the Admin Panel. |

---

### 🚀 Summary Flow Recap:

1. **Admin -> Catalog**: Register Metadata (Draft).
2. **Admin -> Notification**: Open SSE (Standby).
3. **Admin -> Streaming**: Get Presigned URL (Signed).
4. **Browser -> MinIO**: Direct Binary Upload (Ingested).
5. **Admin -> Kafka**: Emit Upload Event (Triggered).
6. **Transcoder -> MinIO**: Generate HLS (Processed).
7. **Kafka -> Notification**: Push Success Signal (Real-Time).
8. **UI -> User**: Mark as "Success" (Completed).
