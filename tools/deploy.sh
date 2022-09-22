#!/usr/bin/env sh

set -e

PROJECT=marmicode-workshop-api-2022-09
IMAGE="europe-west1-docker.pkg.dev/$PROJECT/marmicode/recipes-service"
TAG="next"

log() {
  echo "\n\n $1"
}

update_traffic() {
  gcloud run services update-traffic recipes-service --to-tags "$TAG=$1"
}

echo "🛠 Setting up docker repository..."
gcloud artifacts repositories describe marmicode --project "$PROJECT" --location europe-west1 \
|| gcloud artifacts repositories create marmicode --project "$PROJECT" --location europe-west1 --repository-format docker

log "📦 Packaging application..."
yarn build
docker build . -f src/Dockerfile -t "$IMAGE"
docker push "$IMAGE"

log "🚀 Deploying application..."
CLOUD_RUN_RESULT=$(gcloud run deploy recipes-service  \
  --project "$PROJECT" \
  --region europe-west1 \
  --image "$IMAGE" \
  --allow-unauthenticated \
  --no-traffic \
  --tag "$TAG" \
  --format json)
NEXT_URL=$(echo "$CLOUD_RUN_RESULT" | jq -r '.status.traffic[-1].url')
REVISION_NAME=$(echo "$CLOUD_RUN_RESULT" | jq -r '.status.latestCreatedRevisionName')

log "✅ Running smoke tests..."
BASE_URL="$NEXT_URL" yarn test

log "🧪 Routing 10% traffic..."
update_traffic 10

log "⏳ Waiting 1 min for some traffic..."
sleep 60

log "📝 Checking logs for errors..."
ERROR_LOGS=$(gcloud logging read "resource.type=cloud_run_revision resource.labels.service_name=recipes-service resource.labels.revision_name=$REVISION_NAME severity=ERROR")
if [ -n "$ERROR_LOGS" ]
then
  log "🚨 Rolling back due to errors in logs..."
  echo "$ERROR_LOGS"
  # ... and rollback
  update_traffic 0
  exit 1
else
  log "🎉 All-in, routing 100% traffic..."
  update_traffic 100
  log "✨ Done!"
fi
