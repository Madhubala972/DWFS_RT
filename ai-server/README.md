---
title: Disaster Welfare AI Priority
emoji: 🏗️
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
---

# Disaster Welfare AI Priority Service

This is the AI component of the Transparent Public Welfare Distribution system.
It uses a zero-shot classification model to determine the priority of welfare requests based on their description.

## Deployment on Hugging Face Spaces

1. Create a new Space on [Hugging Face](https://huggingface.co/new-space).
2. Select **Docker** as the SDK.
3. Choose the **Blank** template or upload your files.
4. Ensure the `Dockerfile` and all files in this directory are uploaded.
5. Hugging Face will automatically build and deploy the container.

## API Endpoint

- `GET /`: Health check
- `POST /predict`: Predicts priority from description
  - Body: `{ "description": "text here" }`
  - Returns: `{ "priority": "Critical|High|Medium|Low" }`
