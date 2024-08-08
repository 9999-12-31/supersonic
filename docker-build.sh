## 构建基础镜像
docker build -t harbor.bigdata.com/chatbi/supersonic:base -f docker\Dockerfile-base .
docker push harbor.bigdata.com/chatbi/supersonic:base


docker build --no-cache --build-arg SUPERSONIC_VERSION=0.9.6-SNAPSHOT -t harbor.bigdata.com/chatbi/supersonic:0.9.6-SNAPSHOT -f docker\Dockerfile-chatbi .
docker push harbor.bigdata.com/chatbi/supersonic:0.9.6-SNAPSHOT

docker pull harbor.bigdata.com/chatbi/supersonic:0.9.6-SNAPSHOT
docker save harbor.bigdata.com/chatbi/supersonic:0.9.6-SNAPSHOT | gzip > harbor.bigdata.com-chatbi-supersonic-0.9.6-SNAPSHOT.tar.gz

gunzip -c harbor.bigdata.com-chatbi-supersonic-0.9.6-SNAPSHOT.tar.gz | docker load