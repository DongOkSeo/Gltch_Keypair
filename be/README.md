# quick start

1. init DB

% docker-compose -f ./docker-compose.yaml up -d
% cd db_env
% docker-dbinit.sh hackathon-keypair CONTAINER_ID

2. Back-end service

% yarn install
% yarn build
% yarn dev
