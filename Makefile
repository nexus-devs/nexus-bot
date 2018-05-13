all:

image:
	cd docker; docker build -t $(registry)/nexus-bot .
	cd docker; docker push $(registry)/nexus-bot
