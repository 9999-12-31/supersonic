docker build --no-cache --build-arg SUPERSONIC_VERSION=0.9.6-SNAPSHOT -t harbor.bigdata.com/chatbi/supersonic:0.9.6-SNAPSHOT -f docker\Dockerfile .
docker push harbor.bigdata.com/chatbi/supersonic:0.9.6-SNAPSHOT

docker pull harbor.bigdata.com/chatbi/supersonic:0.9.6-SNAPSHOT
docker save harbor.bigdata.com/chatbi/supersonic:0.9.6-SNAPSHOT | gzip > harbor.bigdata.com-chatbi-supersonic-0.9.6-SNAPSHOT.tar.gz

gunzip -c harbor.bigdata.com-chatbi-supersonic-0.9.6-SNAPSHOT.tar.gz | docker load