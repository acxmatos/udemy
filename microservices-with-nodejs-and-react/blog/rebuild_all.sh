update() {
  local image=$1
  echo
  echo '----------------------------------------'
  echo "Updating ${image}"
  echo '----------------------------------------'
  echo
  echo 'Rebuilding image...'
  echo
  docker build -t acxmatos/$image -f ./$image/Dockerfile ./$image/
  echo
  echo 'Pushing image to Docker Hub...'
  echo
  docker push acxmatos/$image
  echo
  echo 'Updating Kubernetes deployment...'
  echo
  kubectl rollout restart deployment $image-depl
  echo
}

update 'comments'
update 'event-bus'
update 'moderation'
update 'posts'
update 'query'