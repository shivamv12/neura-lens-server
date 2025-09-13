# NeuraLens Backend 🧠

**NeuraLens** Backend is a **fast, scalable, and secure** server built with **NestJS**, powering the NeuraLens platform. It handles seamless image uploads, **AI-driven analysis via LLaMA 4 Maverick**, cloud storage, and efficient retrieval via **CloudFront**. Built with modularity and extensibility in mind, it provides a robust foundation for cross-platform clients and future enhancements.

## 🚀 Features
- 📸 **Image Uploads**: Accepts camera/gallery uploads directly from the mobile app  
- ☁️ **Cloud Storage**: Uploads files to AWS S3 (optimized background uploads)  
- 🤖 **AI Analysis**: Integrated with **LLaMA 4 Maverick (Free API)** for intelligent image analysis  
- 📊 **Scalable Architecture**: Built with NestJS, modular and extensible  
- 🛠 **Developer Friendly**: Clear structure, easy to extend and maintain  
- 🌍 **CDN Ready**: S3 files can be served via **CloudFront (CDN)** for faster delivery globally  
- 🔐 **Secure APIs**: Authentication & authorization ready _(Phase 2)_

## 🏗 Tech Stack
- [**NestJS**](https://nestjs.com/) – Node.js framework  
- [**MongoDB**](https://www.mongodb.com/) – Flexible data persistence  
- [**Mongoose**](https://mongoosejs.com/) – ODM for MongoDB  
- [**AWS S3**](https://aws.amazon.com/s3/) – File storage  
- [**AWS CloudFront**](https://aws.amazon.com/cloudfront/) – CDN for serving media  
- [**LLaMA 4 Maverick**](https://ai.meta.com/llama/) – Free AI API for image analysis  
- [**Docker**](https://www.docker.com/) – Containerization (optional)  

## 🤖 How LLaMA Works (Behind the Scenes)

Unlike **YOLO**, which is optimized for **real-time object detection** (bounding boxes, labels),  
**LLaMA 4 Maverick** is a **L**arge **L**anguage **M**odel with **vision capabilities**.  

- It takes an image (or text + image) as input.
- Internally encodes the visual features, similar to **CLIP (Contrastive Language–Image Pre-training)** style embeddings.
- Combines them with language understanding.
- Generates natural language outputs (captions, analysis, reasoning).

In NeuraLens, we leverage this to **analyze uploaded images** and provide **descriptive insights** rather than just bounding boxes.

## 📝 TL;DR: How LLaMA Analyzes Images

- 🖼 Images are first converted into **CLIP-style embeddings** → numerical vectors that capture meaning.  
- 🔗 These embeddings align image + text in the same space (so the model can "understand" both together).  
- 🧠 LLaMA then uses its language model on top of these embeddings to **describe, analyze, or reason** about the image.  
- ⚡ In contrast, YOLO only detects and labels objects, while CLIP/LLaMA enables **deeper semantic understanding**.

## 🤔 Why LLaMA over YOLO for NeuraLens?

- **YOLO** is great for **real-time object detection** (finding and labeling objects within bounding boxes).  
- **LLaMA (with CLIP embeddings)** is better for **semantic understanding** (explaining context, meaning, and relationships in an image).  
- NeuraLens needs **descriptions and insights**, not just bounding boxes.  

#### Think of it like:  
- **YOLO 👀 (eyes) =** that instantly spots and labels objects.  
- **LLaMA 🧠 (brain) =** that explains what those objects *mean*.  


## ⚡ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/shivamv12/neuralens-backend.git
cd neuralens-backend
```

### 2. Install required deps
```bash
npm install
```
or if you using yarn, you can run
```bash
yarn install
```

### 3. Setup env variables
Create a `.env` file in the root directory of the project. You can refer to the `.env.example` file for the required keys.

**Note:** Some keys are in the `.env.example` file are just placeholders and not currently in use. Below are the required ones for running NeuraLens Server.

```env
# App Config
PORT=

# Database Configs
DB_USER=
DB_PASS=
DB_NAME=
DB_APP_NAME=
DB_CLUSTER=

# AWS S3
AWS_S3_ACCESS_KEY_ID=
AWS_S3_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_S3_REGION=
AWS_CLOUD_FRONT_ENDPOINT=

# Rate Limiting
RATE_LIMIT=

# Logging/Monitoring
LOG_LEVEL=

# LLaMA 4 Maverick access proxy
OPEN_ROUTER_BASE_URL=
OPEN_ROUTER_API_KEY=
```
👉 **OpenRouter**: Acts as a proxy service to access LLaMA 4 Maverick (Free API). It handles authentication, routing, and provides free-tier access between NeuraLens and the LLaMA model.

### 4. Run the app
After successful dependencies installation, and env setup, start the NestJS server with below command:
```bash
npm run start:dev
```

### 5. Run with Docker (optional)  
If you prefer running with Docker:  
```bash
docker build -t neuralens-backend .
docker run -p 3000:3000 --env-file .env neuralens-backend
```

### 6. Expose with Ngrok (optional)  
If you want to expose your local NestJS server to the internet (for mobile testing or external API access), you can use **Ngrok**:  

#### Install ngrok globally (if not installed)
```bash
npm install -g ngrok
```
#### Expose your local server (assuming port 3000)
```bash
ngrok http 3000
```

## 🎯 Conclusion & Future Roadmap (Phase 2)

NeuraLens Backend is a **fast, scalable, and secure NestJS server** that powers image uploads, intelligent AI analysis using **LLaMA 4 Maverick**, and efficient retrieval through S3 + CloudFront.  

### 🔐 Authentication & User History
Add auth system so users can log in and view their previous uploads (history of processed images).

### 🔄 Processing Pipeline & Notifications
Implement a processing pipeline (Or may be with Batch APIs) where failed images can be retried or logged, and optionally push notifications later once failed pictures processed.

### 🚫 Content Safety & Moderation
Integrate a filter (using LLaMA or a lightweight classifier) to prevent generating responses for objectionable / unsafe images.

### 🧠 Custom Model Training (Experimental)
Hypothetical Future goal: Collect datasets of input images + labels to fine-tune a model on NeuraLens-specific use cases. Currently hypothetical, but sets the stage for domain-specific intelligence.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a PR or create an issue.

<!-- ## 📜 License

This project is licensed under the MIT License – see the LICENSE
 file for details. -->

## 🙏 Acknowledgments

- OpenRouter – proxy access for LLaMA 4 Maverick
- Meta AI – creators of LLaMA
- YOLO – inspiration for object detection research
- AWS – cloud storage & CDN support